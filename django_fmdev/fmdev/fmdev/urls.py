from django.contrib import admin
from django.urls import path
from . import views


urlpatterns = [
    path("admin/", admin.site.urls),
    path('arquivos', views.arquivos, name='arquivos'),
    path('colunas', views.colunas, name='colunas'),
    path('treinamento', views.colunas, name='treinamento'),
]
