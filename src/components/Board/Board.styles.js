import styled from "styled-components";

const BoardWrapper = styled.div`
  border: 8px solid #2b2723;
  -webkit-box-shadow: 2px 4px 19px 5px #000000;
  box-shadow: 2px 4px 19px 5px #000000;
  border-radius: 8px;
  height: 100%;
  display: grid;
  @media (max-width: 960px) {
    grid-row: 1;
  }
`;

const BoardRows = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
`;

const BoardColumns = styled.div`
  border-radius: 1px;
  cursor: pointer;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50px;
  font-weight: 600;
  -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.26);
  box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.26);
  background-image: ${(props) =>
    props.background
      ? "url(/assets/dark-cell.png)"
      : "url(/assets/light-cell.png)"};
  @media (min-width: 500px) {
    min-width: 55px;
    min-height: 55px;
  }
`;

const FigurePathHint = styled.div`
  border: ${(props) =>
    props.cellInPath && props.hints ? "2px solid white" : "none"};
  border-radius: 10px;

  min-height: 40px;
  min-width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (min-width: 500px) {
    width: 85%;
    height: 85%;
  }
`;

export { FigurePathHint, BoardColumns, BoardRows, BoardWrapper };
