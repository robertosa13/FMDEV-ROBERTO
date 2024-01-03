from django.contrib import admin
#importar as classes criadas no arquivo de models dentro do app escola
from escola.models import Aluno, Curso, Matricula, Iris


class IrisDataset(admin.ModelAdmin):
        list_display = ('sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'variety') #campos da lista
        list_display_links = ('variety',) 
        search_fields = ('variety',) # campo de busca
        list_per_page = 20

admin.site.register(Iris, IrisDataset) #configuracao do model admin

class Alunos(admin.ModelAdmin):
        list_display = ('id', 'nome', 'rg', 'cpf', 'data_nascimento') #campos da lista
        list_display_links = ('id', 'nome') #campos para alterar
        search_fields = ('nome',) # campo de busca
        list_per_page = 20 #alunos por página


admin.site.register(Aluno, Alunos) #configuraçao do model admin

class Cursos(admin.ModelAdmin):
        list_display = ('id', 'codigo_curso', 'descricao')
        list_display_links = ('id', 'codigo_curso')
        search_fields = ('codigo_curso',)


admin.site.register(Curso, Cursos) #configuracao do model admin


class Matriculas(admin.ModelAdmin):
        list_display = ('id', 'aluno', 'curso', 'periodo')
        list_display_links = ('id',)
        

admin.site.register(Matricula, Matriculas)
        