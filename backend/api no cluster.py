import subprocess
import re

#Função para executar comandos no linux
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

#Comando para buscar todos os arquivos no diretório hdfs arquivs
(ret, out, err)= run_cmd(['hdfs', 'dfs', '-ls', '/arquivos', " | grep -oE '[^ ]+$'"])
decoded_out = str(out.decode('utf-8'))

#Tratamento da string de retorno
arquivos_csv = re.findall(r'/arquivos/([\w\-.]+\.csv)', decoded_out)
print(arquivos_csv)

#Buscar as colunas depois de cada um
#hdfs dfs -cat /arquivos/churn.csv | head -n 1





