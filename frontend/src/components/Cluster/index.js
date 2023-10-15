import React, { Component } from "react";
import { ConfigContainer } from "../../styles/ConfigContainer";

import { Header } from "../../styles/global";
import PerfectScrollbar from "react-perfect-scrollbar";
import { LeftContent, SelectContainer, Content, Separator } from "./styles";
import Button from "../../styles/Button";
import "./ButtonGrid.css"; // Import the CSS file
import "./stylestwo.css"; // Importe o arquivo de estilos

//import './Cluster.css'

//control + space

class ConfigurarIntegracao extends Component {
  state = {
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
}

const Formulario = () => {
  return (
    <PerfectScrollbar style={{ width: "100%", overflowX: "auto" }}>
      <ConfigContainer size="big" style={{ color: "#000" }}>
        <Header>
          <h1>Administração Cluster</h1>
        </Header>

        <Content>
          <LeftContent>
            <div className="button-grid">
              <Button onClick={() => {}}>Resource Manager</Button>
              <Button onClick={() => {}}>NameNode WebUI</Button>
              <Button onClick={() => {}}>HDFS</Button>
              <Button onClick={() => {}}>WebUI Spark Master</Button>
              <Button onClick={() => {}}>Node Manager</Button>
              <Button onClick={() => {}}>Jupyter</Button>
              <Button onClick={() => {}}>Spark</Button>
            </div>
          </LeftContent>
          <Separator> </Separator>

          <div className="form-content">
            {" "}
            {/* Aplicando a classe form-content */}
            <div>
              <label htmlFor="url" className="label-style">
                NODE MASTER IP:
              </label>
              <input
                type="text"
                id="url"
                name="url"
                className="input-style"
                defaultValue="172.18.0.4"
              />
            </div>
            <div>
              <label htmlFor="port" className="label-style">
                Port:
              </label>
              <input
                type="text"
                id="port"
                name="port"
                className="input-style"
                defaultValue="80:80"
              />
            </div>
            <div>
              <label htmlFor="mode" className="label-style">
                Deploy Mode:
              </label>
              <input
                type="text"
                id="mode"
                name="Deploy mode"
                className="input-style"
                defaultValue="Cluster"
              />
            </div>
            <div>
              <label htmlFor="mode" className="label-style">
                Hadoop Version:
              </label>
              <input
                type="text"
                id="hadoop"
                name="hadoop"
                className="input-style"
                defaultValue="2.7.0"
              />
            </div>
            <div>
              <label htmlFor="mode" className="label-style">
                Spark Version:
              </label>
              <input
                type="text"
                id="spark"
                name="spark"
                className="input-style"
                defaultValue="2.4.8"
              />
            </div>
          <div>
            <label htmlFor="mode" className="label-style">
              Endpoint:
            </label>
            <input
              type="text"
              id="endpoint"
              name="endpoint"
              className="input-style"
              defaultValue="spark://172.18.0.4:7077"
            />
          </div>
          </div>
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
