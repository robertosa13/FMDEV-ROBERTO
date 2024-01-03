import requests
import seaborn as sns
import pandas as pd
import json

df = sns.load_dataset('iris')
print(df.head(5))

df = df.rename(columns={'sepal_length': 'sepalLength',
                        'sepal_width': 'sepalWidth',
                        'petal_length': 'petalLength',
                        'petal_width': 'petalWidth',
                        'species': 'variety'
                        })


json_data = df.to_json(orient='records')
lista_de_dicionarios = json.loads(json_data)

for dado in lista_de_dicionarios:
    print(dado)
    url = 'http://127.0.0.1:8000/irisDataset/'
    #dados = {'chave1': 'valor1', 'chave2': 'valor2'}

    # Enviar o POST request
    resposta = requests.post(url, data=dado)

    if resposta.status_code == 200:
        print('POST bem-sucedido!')
        print('Resposta da API:', resposta.text)
    else:
        print('Erro ao enviar o POST. Código de status:', resposta.status_code)
        print('Resposta da API:', resposta.text)