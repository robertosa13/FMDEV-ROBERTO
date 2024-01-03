import requests

#URL DA DJANGO REST API -->
url = 'http://127.0.0.1:8000'
response = requests.get(url)

if response.status_code == 200:
    json_data = response.json()
    tablesNames = list(json_data.keys())
    print(tablesNames)
    
    
else:
    print(f"Request failed with status code {response.status_code}")