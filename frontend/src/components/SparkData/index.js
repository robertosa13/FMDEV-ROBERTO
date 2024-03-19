import React, { useState, useEffect } from "react";
import { ConfigContainer } from "../../styles/ConfigContainer";
import { Header } from "../../styles/global";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Content } from "./styles";
import { api_spark } from "../Indicators";
import api from "../../services/api";
import MyComponent from "./styles";
import {SpinnerContainer, Spinner, Message, } from "./styles";
import ComponentComTooltip from "./styles";
import "./styles.css";



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
              {responseData.resultado.model_id}  
              <table className="modern-table">
                  <thead>
                    <tr>
                      <th style={{ width: "400px" }}>Identificação do modelo </th>
                      <th style={{ width: "200px" }}>Acurácia <ComponentComTooltip text = "Quanto maior a acurácia, melhor é a capacidade do modelo de classificação em distinguir entre as classes. Uma acurácia de 1 indica um modelo perfeito que é capaz de distinguir perfeitamente entre as classes."/></th>
                      <th style={{ width: "150px" , display: "none" }}> Log Loss <ComponentComTooltip text = "O resultado do cálculo do Log-Loss é um valor numérico que indica o quão bem o modelo está se ajustando aos dados de teste. Quanto menor o valor do Log-Loss, melhor é a performance do modelo."/></th>
                      <th style={{ width: "150px" , display: "none" }}>AUCPR <ComponentComTooltip text="AUCPR = 1 significa que seu modelo sempre prevê corretamente as classes positivas e negativas"/></th>
                      <th style={{ width: "300px" }}>Erro Médio por Classe <ComponentComTooltip text = "Erro Médio por Classe (Mean Class Error) é uma métrica usada para avaliar a performance de um modelo de classificação, especialmente em problemas com múltiplas classes. Ele calcula a média dos erros de classificação para cada classe individualmente. Quanto menor o valor do Erro Médio por Classe, melhor é o desempenho do modelo, indicando que o modelo está fazendo menos erros ao classificar os dados em cada classe. "/></th>
                      <th style={{ width: "150px" }}>RMSE <ComponentComTooltip text = "A Raiz do Erro Quadrático Médio (RMSE) é uma medida semelhante ao Erro Quadrático Médio (MSE), mas é calculada tomando a raiz quadrada do valor médio dos quadrados dos erros entre as previsões do modelo e os valores reais. Quanto menor o valor do RMSE, melhor é o desempenho do modelo, indicando que as previsões do modelo estão mais próximas dos valores reais. "/></th>
                      <th style={{ width: "100px" }}>MSE <ComponentComTooltip text = "Quanto menor o valor do MSE, melhor é o desempenho do modelo, indicando que os valores previstos estão mais próximos dos valores reais. Em resumo, um valor baixo de MSE significa que o modelo tem uma precisão mais alta em suas previsões."/></th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseData.resultado.split("\n").map((row, index) => {
                      const rowData = row.trim().split(/\s+/);

                      if (rowData[0].startsWith("lb:")) {
                        return null; // Ignorar a linha
                      }

                      if (rowData[0].startsWith("[")) {
                        return null; // Ignorar a linha
                      }

                      return (
                        <tr key={index}>
                          {rowData.map((data, dataIndex) => (

                            (dataIndex !== 2 && dataIndex !== 3) ? (
                          
                            <td key={dataIndex} style={{ textAlign: dataIndex !== 0 ? 'center' : 'left' }}>{data}</td>
                            ) : null
                          
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>            
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
