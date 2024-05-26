from django.contrib import admin
from django.urls import path
from . import views

from django.urls import re_path


from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
   openapi.Info(
      title="Documentação API FMD",
      default_version='v1',
      description="Documentação do FMD django rest",
      terms_of_service="",
      contact=openapi.Contact(email="rsbpc@ecomp.poli.br"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path('arquivos', views.arquivos, name='arquivos'),
    path('colunas', views.colunas, name='colunas'),
    path('treinamento', views.treinamento, name='treinamento'),
    path('dados', views.dados, name='dados'),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

]
