import React, { useState, useEffect } from "react";
import { ConfigContainer } from "../../styles/ConfigContainer";
import { Header } from "../../styles/global";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Content } from "./styles";
import { api_spark } from "../Indicators";
import api from "../../services/api";
import MyComponent from "./styles";
import {SpinnerContainer, Spinner, Message } from "./styles";

const Formulario = () => {
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [responseData, setResponseData] = useState(null); // Estado para armazenar a resposta da API

  var a;

  useEffect(() => {
    const fetchFromSparkAPI = async () => {
      try {
        // Faz o POST para a API usando o valor de api_spark
        const response = await api.get(api_spark);
        setResponseData(response.data)
        console.log("roberto " + JSON.stringify(response.data))
        console.log("roberto 2" + response.data.resultado.toString())

        
        setLoading(false); // Define o estado de carregamento como falso

      } catch (error) {
        console.error("Erro ao fazer o POST para a API:", error);
      }
    };

    fetchFromSparkAPI(); // Chama a função para buscar os dados da API ao renderizar a página
  }, []); // [] assegura que o useEffect seja executado apenas uma vez, sem depender de variáveis de estado

  return (
    <PerfectScrollbar style={{ width: "100%", overflowX: "auto" }}>
      <ConfigContainer size="big" style={{ color: "#000" }}>
        <Header>
          <h1>Análise do AutomL</h1>        
        </Header>

        <Content>
          {loading ? ( // Verifica se está carregando
            <div>
              <SpinnerContainer>              
              <Spinner />
              <Message> O treinamento de AutoML iniciou-se...</Message>
            </SpinnerContainer>                          
            </div> // Exibe uma mensagem de carregamento  
                       
                  

          ) : (
            <div>            
            {responseData && responseData.resultado ? (
              <div>            
              <ul>
                {responseData.resultado.split("\n").map((row, index) => {

                  
                  // Split each row by spaces
                  const rowData = row.trim().split(/\s+/);

                  if (row.trim().startsWith("model_path::")) {
                    return null; // Retorna null para não renderizar o item
                  }

                  return (
                    <li key={index}>
                      <strong>{rowData[0]}:</strong> {rowData.slice(1).join(", ")}
                    </li>
                  );
                })}
              </ul>
              </div>           
            ) : (
              <p>Nenhum dado disponível</p>
            )}
          </div>
          )}
        </Content>
      </ConfigContainer>
    </PerfectScrollbar>
  );
}

export default Formulario;
