from rest_framework import serializers
from escola.models import Aluno, Curso, Matricula, Iris


class IrisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Iris
        fields = '__all__' #disponibiliza para api todos os campos

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        fields = ['id', 'nome', 'rg', 'cpf', 'data_nascimento']  #disponibiliza para api alguns campos

class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = '__all__' #disponibiliza para api todos os campos

class MatriculaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Matricula
        exclude = []
        #exlude = ['id'] --> traria todos os campos com execessão do id

# código anterior omitido
class ListaMatriculasAlunoSerializer(serializers.ModelSerializer):
    curso = serializers.ReadOnlyField(source='curso.descricao')
    periodo = serializers.SerializerMethodField()

    class Meta:
        model = Matricula
        fields = ['curso', 'periodo']

    def get_periodo(self, obj):
        return obj.get_periodo_display()

class ListaAlunosMatriculadosSerializer(serializers.ModelSerializer):
    aluno_nome = serializers.ReadOnlyField(source='aluno.nome')
    class Meta:
        model = Matricula
        fields = ['aluno_nome']