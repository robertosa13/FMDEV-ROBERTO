from rest_framework import viewsets, generics
from escola.models import Aluno, Curso, Matricula, Iris
from escola.serializer import IrisSerializer, AlunoSerializer, CursoSerializer, MatriculaSerializer, ListaMatriculasAlunoSerializer, ListaAlunosMatriculadosSerializer
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from pyspark.sql import SparkSession


from django.http import JsonResponse

def spark(request):

    #http://localhost:8000/spark/?parametro1=${parametro1}&parametro2=${parametro2}
    #sintaxe do get 

    parametro1 = request.GET.get('parametro1', '')
    parametro2 = request.GET.get('parametro2', '')
    resultado = f"Parâmetro 1: {parametro1}, Parâmetro 2: {parametro2}"

    spark = SparkSession.builder.appName("HelloWorld").getOrCreate()
    sc = spark.sparkContext

    nums = sc.parallelize([1,2,3,4])
    print(nums.map(lambda x: x*x).collect())
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