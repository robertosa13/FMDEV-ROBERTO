
import React, { Component } from 'react';
import { ConfigContainer } from '../../styles/ConfigContainer';

import {
  Header
} from '../../styles/global';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { LeftContent, SelectContainer, Content, Separator } from './styles';
import Button from '../../styles/Button';

//import './Cluster.css'

//control + space

const Formulario = () => {

    return(

<PerfectScrollbar style={{ width: '100%', overflowX: 'auto' }}>
        <ConfigContainer size='big' style={{ color: '#000' }}>

          <Header>
            <h1>Cluster de Big Data</h1>
          </Header>

          <Content>


            <LeftContent>            


              <Button onClick={() => { }}>Gerar Análise</Button>

            </LeftContent>

            <Separator>&nbsp;</Separator>
          </Content>

          {/* {!data.length && !loading ?
            <StatusMsgContainer> Sem dados para serem exibidos. </StatusMsgContainer>
            : null} */}

          {/*loading ?
            <LoadingContainer>
              <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" fill="#EEEEEE" animationDuration=".5s" />
            </LoadingContainer>
          : null*/}

        </ConfigContainer >
      </PerfectScrollbar>

    
    
        )}


export default Formulario