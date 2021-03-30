import styled from "styled-components";

const TakenFiguresWrapper = styled.div`
  padding: 10px 0;
  @media (max-width: 960px) {
    grid-row: 3;
  }
`;

const TakenFigure = styled.li`
  font-size: 32px;
  text-align: center;
`;

const TakenFiguresBox = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 50px;
  grid-gap: 5px;
`;

export { TakenFiguresWrapper, TakenFigure, TakenFiguresBox };
