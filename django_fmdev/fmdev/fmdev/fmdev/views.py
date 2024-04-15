from django.http import JsonResponse
import subprocess
import re
import requests
from django.http import JsonResponse
import h2o
from h2o.automl import H2OAutoML
import joblib
import zipfile
import os


def run_cmd(args_list):
        """
        run linux commands
        """
        # import subprocess
        print('Running system command: {0}'.format(' '.join(args_list)))
        proc = subprocess.Popen(args_list, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        s_output, s_err = proc.communicate()
        s_return =  proc.returncode
        return s_return, s_output, s_err 


def run_cmd_pipes(cmd):
    """
    Run linux commands that can include pipes.
    """
    print(f'Running system command: {cmd}')
    proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
  
    s_output, s_err = proc.communicate()
    s_return = proc.returncode

    return s_return, s_output, s_err

def arquivos(request):

    #Comando para buscar todos os arquivos no diretório hdfs arquivs
    (ret, out, err)= run_cmd(['hdfs', 'dfs', '-ls', '/arquivos', " | grep -oE '[^ ]+$'"])
    decoded_out = str(out.decode('utf-8'))
    
    arquivos_csv = re.findall(r'/arquivos/([\w\-.]+\.csv)', decoded_out)
    

    data = {"message": arquivos_csv}  
    return JsonResponse(data)

def colunas(request):
    file = request.GET.get('file', '')
    (ret, out, err)= run_cmd_pipes('hdfs dfs -cat /arquivos/' + file + ' | head -n 1')
    decoded_out = str(out.replace("\n", ""))
    
    data = {"message": decoded_out}
    return JsonResponse(data)



def dados(request):
    file = request.GET.get('file', '')
    (ret, out, err)= run_cmd_pipes('hdfs dfs -cat /arquivos/' + file + ' | head -n 6')
    decoded_out = str(out.replace("\n", "\n"))
    
    data = {"message": decoded_out}
    return JsonResponse(data)

def treinamento(request):
    print("inicio")

    file = request.GET.get('file', '')
    path = 'hdfs://master:/arquivos/' + file
    print(path)
    target = request.GET.get('target', '')
    columns = request.GET.get('columns', '').split(',')
    print(target)
    print(columns)

    h2o.init(ip="10.5.0.3", port=54321)
    df = h2o.import_file(path = path)
    df.describe()

    train,test,valid = df.split_frame(ratios=[.7, .15])

    #y = "Churn"
    y = target
    #x = churn_df.columns
    x =  df.columns
    print(df.columns)
    print(x)
    x.remove(y)
    #x.remove("customerID")
    
    #verbosity="info",
    #aml = H2OAutoML(max_models = 10, seed = 10, exclude_algos = ["StackedEnsemble", "DeepLearning"],  nfolds=0)
    aml = H2OAutoML(max_models = 2, seed = 10, include_algos = ["DRF"],  nfolds=0)

    aml.train(x = x, y = y, training_frame = train, validation_frame=valid)

    churn_pred=aml.leader.predict(test)

    churn_pred.head()

    aml.leader.model_performance(test)

    model_ids = list(aml.leaderboard['model_id'].as_data_frame().iloc[:,0])

    lb = aml.leaderboard
    best_model = aml.leader
    print("Melhor modelo:", best_model.model_id)
    model_path = aml.leader.download_mojo(path = "/Users/roberto/fmdev/backend/data/models/") 

    #resultado = f"model_path: {model_path}, best_model: {best_model.model_id}, lb: {lb}"  
    resultado = f"lb: {lb}"
  
    return JsonResponse({'resultado': resultado})




