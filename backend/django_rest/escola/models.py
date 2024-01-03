from django.db import models


class Iris(models.Model):
    sepalLength = models.DecimalField(decimal_places = 2,max_digits = 5)
    sepalWidth  = models.DecimalField(decimal_places = 2,max_digits = 5)
    petalLength = models.DecimalField(decimal_places = 2,max_digits = 5)
    petalWidth  = models.DecimalField(decimal_places = 2,max_digits = 5)
    variety = models.CharField(max_length= 20)

    def __str__(self):
        return self.variety

class Aluno(models.Model):
    nome = models.CharField(max_length=30)
    rg = models.CharField(max_length=9)
    cpf = models.CharField(max_length=11)
    data_nascimento = models.DateField()

    def __str__(self):
        return self.nome

class Curso(models.Model):
    NIVEL = (
        ('B', 'Básico'),
        ('I', 'Intermediário'),
        ('A', 'Avançado')
    )
    codigo_curso = models.CharField(max_length=10)
    descricao = models.CharField(max_length=100)
    nivel = models.CharField(max_length=1, choices=NIVEL, blank=False, null=False,default='B')

    def __str__(self):
        return self.descricao
    

class Matricula(models.Model):
        PERIODO = (
                ('M', 'Matutino'),
                ('V', 'Vespertino'),
                ('N', 'Noturno')
        )
        aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
        #ondelete models.cascade significa que quando um aluno for deletado, a matricula tbm vai ser
        curso = models.ForeignKey(Curso, on_delete=models.CASCADE)

        #campo periodo
        periodo = models.CharField(max_length=1, choices=PERIODO, blank=False, null=False,default='M')



    