import styled from "styled-components";

export const AppBox = styled.div`
  height: 100vh;
  background-image: url("/assets/wood-background1.png");
  @media (max-width: 500px) {
    padding: 10px 10px;
    height: 200vh;
  }
  @media (max-width: 960px) {
    height: 150vh;
  }
`;

export const GameWrapper = styled.div`
  display: grid;
  height: 90vh;
  @media (max-width: 960px) {
    grid-template-rows: 1fr 200px 1fr;
    grid-gap: 10px;
  }
  @media (min-width: 960px) {
    grid-template-columns: 200px 1fr 250px;
    grid-gap: 20px;
  }
`;
