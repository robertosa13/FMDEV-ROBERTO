from rest_framework import viewsets, generics
from escola.models import Aluno, Curso, Matricula, Iris
from escola.serializer import IrisSerializer, AlunoSerializer, CursoSerializer, MatriculaSerializer, ListaMatriculasAlunoSerializer, ListaAlunosMatriculadosSerializer
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated
#from pyspark.sql import SparkSession
import requests
from django.http import JsonResponse
import h2o
from h2o.automl import H2OAutoML
import joblib
import zipfile
import os




def spark(request):

    target = request.GET.get('target', '')
    columns = request.GET.get('columns', '')
    url = 'http://' + request.GET.get('url', '')

    #spark = SparkSession.builder.appName("FMDEV").getOrCreate()
    #sc = spark.sparkContext
  
    def get_all_data(api_url):
        all_data = []

        while api_url:            
            response = requests.get(api_url)

            
            if response.status_code == 200:
                all_data.extend(response.json()['results'])
                api_url = response.json()['next']
            else:
                response.raise_for_status()

        return all_data



    dados = get_all_data(url)

    #rdd = spark.sparkContext.parallelize(dados)
    #df = spark.read.json(rdd)
    #sc.stop()


    h2o.init()

    churn_df = h2o.import_file('https://raw.githubusercontent.com/srivatsan88/YouTubeLI/master/dataset/WA_Fn-UseC_-Telco-Customer-Churn.csv')
    print(churn_df.types)

    churn_df.describe()

    churn_train,churn_test,churn_valid = churn_df.split_frame(ratios=[.7, .15])

    y = "Churn"
    x = churn_df.columns
    x.remove(y)
    x.remove("customerID")

    #verbosity="info",
    aml = H2OAutoML(max_models = 10, seed = 10, exclude_algos = ["StackedEnsemble", "DeepLearning"],  nfolds=0)

    aml.train(x = x, y = y, training_frame = churn_train, validation_frame=churn_valid)

    churn_pred=aml.leader.predict(churn_test)

    churn_pred.head()

    aml.leader.model_performance(churn_test)

    print(aml.leader.model_performance(churn_test))

    model_ids = list(aml.leaderboard['model_id'].as_data_frame().iloc[:,0])
    #se = h2o.get_model([mid for mid in model_ids if "StackedEnsemble_AllModels" in mid][0])
    #metalearner = h2o.get_model(se.metalearner()['name'])
    print(model_ids)

    # Obtenha o leaderboard
    lb = aml.leaderboard

    # Imprima o leaderboard
    print(lb)

    # Obtenha o modelo líder
    best_model = aml.leader
    print("Melhor modelo:", best_model.model_id)

    #h2o.get_model([mid for mid in model_ids if "XGBoost" in mid][0])

    model_path = aml.leader.download_mojo(path = "/Users/roberto/fmdev/backend/data/models/") 

    #resultado = f"model_path: {model_path}, best_model: {best_model.model_id}, lb: {lb}"  
    resultado = f"lb: {lb}"
   
    #return JsonResponse({'resultado': resultado})
    return JsonResponse({'resultado': resultado})




class IrisViewSet(viewsets.ModelViewSet):
    queryset = Iris.objects.all()
    serializer_class = IrisSerializer

class AlunosViewSet(viewsets.ModelViewSet):
    """Exibindo todos os alunos e alunas"""  #exibe encima da class o que ela faz
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer

class CursosViewSet(viewsets.ModelViewSet):
    """Exibindo todos os cursos"""
    queryset = Curso.objects.all() #passa todos os dados do banco
    serializer_class = CursoSerializer #passar a classe do serializar

class MatriculaViewSet(viewsets.ModelViewSet):
    """Listando todas as matrículas"""
    queryset = Matricula.objects.all()
    serializer_class = MatriculaSerializer


class ListaMatriculasAluno(generics.ListAPIView):
    """Listando as matrículas de um aluno ou aluna"""
    def get_queryset(self):
        queryset = Matricula.objects.filter(aluno_id=self.kwargs['pk']) #pk tem que ser o msm parametro que passo na url.py
        return queryset
    serializer_class = ListaMatriculasAlunoSerializer
    
class ListaAlunosMatriculados(generics.ListAPIView):
    """Listando alunos e alunas matriculados em um curso"""
    def get_queryset(self):
        queryset = Matricula.objects.filter(curso_id=self.kwargs['pk'])
        return queryset
    serializer_class = ListaAlunosMatriculadosSerializer