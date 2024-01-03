
from django.shortcuts import HttpResponse 
import pandas as pd 
  
def Table(request): 
    

    # Create a dictionary

    data = {
        'Name': ['Alice', 'Bob', 'Charlie', 'David'],
        'Age': [25, 30, 22, 35],
        'City': ['New York', 'Los Angeles', 'Chicago', 'Houston']
    }
    # Create a DataFrame from the dictionary
    df = pd.DataFrame(data)

    geeks_object = df.to_html() 
  
    return HttpResponse(geeks_object) 





