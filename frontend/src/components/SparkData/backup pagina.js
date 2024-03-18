import React, { Component } from "react";
import { ConfigContainer } from "../../styles/ConfigContainer";

import { Header } from "../../styles/global";
import PerfectScrollbar from "react-perfect-scrollbar";
import { LeftContent, SelectContainer, Content, Separator } from "./styles";
import Button from "../../styles/Button";
import "./ButtonGrid.css"; // Import the CSS file
import "./stylestwo.css"; // Importe o arquivo de estilos
import { api_spark } from "../Indicators";
import api from "../../services/api";




class ConfigurarIntegracao extends Component {

    
  /*state = {
    url: "Valor Padrão do IP",
    token: "Valor Padrão da Chave de API",
    version: null, // Deixe null se não tiver uma versão selecionada inicialmente
  };



  handleChangeInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  

  handleChangeVersion = (selectedOption) => {
    this.setState({ version: selectedOption });

  };
  */
}

const Formulario = () => {
  return (
    <PerfectScrollbar style={{ width: "100%", overflowX: "auto" }}>
      <ConfigContainer size="big" style={{ color: "#000" }}>
        <Header>
          <h1>Análise do AutomL</h1>        
        </Header>

        <Content>        
        <h2>API Spark: {api_spark}</h2>      
        </Content>

        {/* {!data.length && !loading ?
            <StatusMsgContainer> Sem dados para serem exibidos. </StatusMsgContainer>
            : null} */}

        {/*loading ?
            <LoadingContainer>
              <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" fill="#EEEEEE" animationDuration=".5s" />
            </LoadingContainer>
          : null*/}
      </ConfigContainer>
    </PerfectScrollbar>
  );
}

export default Formulario;
