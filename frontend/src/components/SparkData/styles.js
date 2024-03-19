import styled, { keyframes } from 'styled-components';


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