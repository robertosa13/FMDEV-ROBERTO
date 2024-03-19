import styled, { keyframes } from 'styled-components';
import React from 'react';

export const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 16vw;
  max-width: 16vw;
`;

export const SelectContainer = styled.div`
  padding-bottom: 3vh;
  width: 100%;
`;

export const Content = styled.div`
  display: flex;
  padding-top: 0;
  margin: 2rem;
`;

export const Separator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 2 svw;
  border-left: 2px dotted #000;
  margin: 0.5rem;
`;


export const labelStyle = styled.div`
font-weight: bold;
  margin-right: 10px; 
  color: #333; `
;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const SpinnerContainer = styled.div`
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
display: flex;
justify-content: center;
align-items: center;
height: 100px; 
`;

export const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #333; 
  border-radius: 50%;
  width: 300px; 
  height: 300px; 
  animation: ${spin} 1s linear infinite;
`;

export const Message = styled.div`
  margin-top: 20px; 
  margin-left: 20px; 
  font-size: 25px; 
  color: #333; /
`;

const Tooltip = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`;

const TooltipText = styled.span`
  visibility: hidden;
  width: 600px;
  background-color: #4A5173;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;

  ${Tooltip}:hover & {
    visibility: visible;
  }
`;

const Icon = styled.div`
  width: 24px;
  height: 24px;
  background-color: #4A5173;
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
`;

const ComponentComTooltip = ({ text }) => (
  <Tooltip>
      <Icon>i</Icon>
    <TooltipText>{text}</TooltipText>
  </Tooltip>
);

export default ComponentComTooltip;

