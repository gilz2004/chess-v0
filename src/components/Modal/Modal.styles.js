import styled from "styled-components";

export const ModalWrapper = styled.div`
  position: absolute;
  height: 90%;
  overflow: hidden;
  width: 100%;
  background: #563e3a;
  opacity: 0.55;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalInfo = styled.div`
  width: 18%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
  border-radius: 20px;
  flex-direction: column;
  color: white;
  background: black;
  font-weight: 600;
  padding: 10px 0;
  font-size: 1.5rem;

  @media (max-width: 960px) {
    width: 85%;
    position: absolute;
    top: 135px;
  }
`;
