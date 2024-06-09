from django.http import JsonResponse
from django.http import FileResponse, Http404
import subprocess
import re
import requests
from django.http import JsonResponse
import h2o
from h2o.automl import H2OAutoML
import joblib
import zipfile
import os
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view


def run_cmd(args_list):
        
        print('Running system command: {0}'.format(' '.join(args_list)))
        proc = subprocess.Popen(args_list, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        s_output, s_err = proc.communicate()
        s_return =  proc.returncode
        return s_return, s_output, s_err 


def run_cmd_pipes(cmd):
    
    print(f'Running system command: {cmd}')
    proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
  
    s_output, s_err = proc.communicate()
    s_return = proc.returncode

    return s_return, s_output, s_err


@swagger_auto_schema(method='get', operation_summary='Lista arquivos CSV em um diretório HDFS')
@api_view(['GET'])
def arquivos(request):

    #Comando para buscar todos os arquivos no diretório hdfs arquivs
    (ret, out, err)= run_cmd(['hdfs', 'dfs', '-ls', '/arquivos', " | grep -oE '[^ ]+$'"])
    decoded_out = str(out.decode('utf-8'))
    
    arquivos_csv = re.findall(r'/arquivos/([\w\-.]+\.csv)', decoded_out)
    

    data = {"message": arquivos_csv}  
    return JsonResponse(data)

@swagger_auto_schema(method='get', operation_summary='Obtém as colunas do arquivo CSV especificado no HDFS')
@api_view(['GET'])
def colunas(request):
    file = request.GET.get('file', '')
    (ret, out, err)= run_cmd_pipes('hdfs dfs -cat /arquivos/' + file + ' | head -n 1')
    decoded_out = str(out.replace("\n", ""))
    
    data = {"message": decoded_out}
    return JsonResponse(data)


@swagger_auto_schema(method='get', operation_summary='Exibe as primeiras seis linhas do arquivo CSV no HDFS')
@api_view(['GET'])
def dados(request):
    file = request.GET.get('file', '')
    (ret, out, err)= run_cmd_pipes('hdfs dfs -cat /arquivos/' + file + ' | head -n 6')
    decoded_out = str(out.replace("\n", "\n"))
    
    data = {"message": decoded_out}
    return JsonResponse(data)

@swagger_auto_schema(method='GET', operation_summary='Executa treinamento de modelos.')
@api_view(['GET'])
def treinamento(request):
    
    k = request.GET.get('k', '')
    algorithms = request.GET.get('algorithms', '').split(',')
    file = request.GET.get('file', '')
    path = 'hdfs://master:/arquivos/' + file
    target = request.GET.get('target', '')
    columns = request.GET.get('columns', '').split(',')
    algorithms = request.GET.get('algorithms', '').split(',')


    h2o.init(ip="10.5.0.3", port=54321)
    df = h2o.import_file(path = path, col_types={target: 'enum'})
    df.describe()

    train,test,valid = df.split_frame(ratios=[.7, .15])

    y = target
    x = df.columns
    x.remove(y)
    
    aml = H2OAutoML(max_models = 10, seed = 10, include_algos = algorithms, verbosity = "debug", nfolds=int(k))
    aml.train(x = x, y = y, training_frame = train, validation_frame=valid)

    pred=aml.leader.predict(test)

    pred.head()

    aml.leader.model_performance(test)

    model_ids = list(aml.leaderboard['model_id'].as_data_frame().iloc[:,0])

    lb = aml.leaderboard
    best_model = aml.leader
    print("Melhor modelo:", best_model.model_id)
    model_path = aml.leader.download_mojo(path = "/fmdev/fmdev/models/") 

    resultado = f"lb: {lb}"
  
    return JsonResponse({'resultado': resultado})

@swagger_auto_schema(method='get', operation_summary='Baixa o melhor modelo treinado')
@api_view(['GET'])
def modelo(request):
    model = request.GET.get('model', '')
    file_path = os.path.join('/fmdev/fmdev/models/', model)
    if os.path.exists(file_path):
        response = FileResponse(open(file_path, 'rb'), as_attachment=True, filename=model)
        return response
    else:
        raise Http404("File does not exist")

