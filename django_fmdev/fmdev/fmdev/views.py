from django.http import JsonResponse
import subprocess
import re


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
    (ret, out, err)= run_cmd_pipes('hdfs dfs -cat /arquivos/iris.csv | head -n 1')
    decoded_out = str(out.replace("\n", ""))
    
    data = {"message": decoded_out}
    return JsonResponse(data)

def treinamento(request):
    data = {"message": "treinamento"}
    return JsonResponse(data)


