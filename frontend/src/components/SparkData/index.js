import React, { useState, useEffect } from "react";
import { ConfigContainer } from "../../styles/ConfigContainer";
import { Header } from "../../styles/global";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Content } from "./styles";
import { api_spark } from "../Indicators";
import api from "../../services/api";
import MyComponent from "./styles";


const Formulario = () => {
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [responseData, setResponseData] = useState(null); // Estado para armazenar a resposta da API

  useEffect(() => {
    const fetchFromSparkAPI = async () => {
      try {
        // Faz o POST para a API usando o valor de api_spark
        const response = await api.get(api_spark);


        // Se necessário, você pode fazer algo com a resposta aqui
        console.log("Resposta da API:", response.data);
        setResponseData(response.data); // Armazena os dados da resposta da API
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
            <div>Loading.........
                           
                          
            </div> // Exibe uma mensagem de carregamento  
                       
                  

          ) : (
            <div>
              <h2>API Spark: {api_spark}</h2>
              {/* Aqui você pode usar responseData para exibir os dados recebidos da API */}
            </div>
          )}
        </Content>
      </ConfigContainer>
    </PerfectScrollbar>
  );
}

export default Formulario;
