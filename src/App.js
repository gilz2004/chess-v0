import React from "react";
import styled from "styled-components";
import "./app.styles.css";
import { figureDraw } from "./boardEssentials";
import useGame from "./useGame";

const AppBox = styled.div`
  @media (max-width: 500px) {
    padding: 10px 10px;
  }
`;

const Title = styled.h1`
  text-align: center;
  margin: 10px 0;
  color: #64341b;
`;

const GameWrapper = styled.div`
  display: grid;
  height: 90vh;
  @media (max-width: 960px) {
    grid-template-rows: 1fr 90px 250px;
    grid-gap: 10px;
  }
  @media (min-width: 960px) {
    grid-template-columns: 200px 1fr 250px;
    grid-gap: 20px;
  }
`;

const BoardWrapper = styled.div`
  border: 20px solid #64341b;
  height: 100%;
  display: grid;
  -webkit-box-shadow: -1px -1px 15px -1px rgba(0, 0, 0, 0.51);
  box-shadow: -1px -1px 15px -1px rgba(0, 0, 0, 0.51);
  @media (max-width: 960px) {
    grid-row: 1;
  }
`;

const BoardRows = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
`;

const BoardColumns = styled.div`
  cursor: pointer;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50px;
  font-weight: 600;
  -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.26);
  box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.26);
  background: ${(props) => (props.background ? "#D8AD8D" : "#78492F")};
  // color: ${(props) => (props.figureColor === "white" ? "white" : "black")};

  @media (min-width: 500px) {
    min-width: 55px;
    min-height: 60px;
  }
`;

const Figure = styled.div`
  color: ${(props) => (props.figureColor === "white" ? "white" : "black")};
  font-size: ${(props) => (props.checkCell ? "42px" : "38px")};
  font-weight: ${(props) => (props.checkCell ? "900" : "400")};
  border: ${(props) => (props.pickedBorder ? "1px solid white" : "none")};
  outline: none;
  @media (max-width: 500px) {
    font-size: ${(props) => (props.checkCell ? "35px" : "25px")};
  }
`;

const FigurePathHint = styled.div`
  border: ${(props) => (props.cellInPath ? "2px solid white" : "none")};
  border-radius: 10px;
  width: 85%;
  height: 85%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GameDetailsBox = styled.div`
  text-align: center;
  color: #64341b;
  @media (max-width: 960px) {
    grid-row: 2;
  }
`;

const CurrPlayer = styled.p`
  font-size: 20px;
  margin-top: 20px;
`;

const GameStatus = styled.div`
  margin-top: 20px;
`;

const GameOverMsg = styled.p`
  text-decoration: underline;
  font-size: 18px;
  margin-bottom: 10px;
`;

const NewGameBtn = styled.button`
  padding: 10px;
  background: none;
  margin-top: 20px;
  border-radius: 8px;
  cursor: pointer;
`;

const TakenFiguresBox = styled.div`
  @media (max-width: 960px) {
    grid-row: 3;
  }
`;

const TakenFigures = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 50px;
  grid-gap: 5px;
`;

const TakenFigure = styled.li`
  font-size: 32px;
  text-align: center;
`;

export default function App() {
  const state = useGame();
  const { gameStatus, takenFigures, resetGame } = state;

  return (
    <AppBox>
      <Title>Chess Game</Title>
      <GameWrapper>
        <GameDetailsBox>
          <h2>Game details</h2>
          <CurrPlayer>{state.player} player turn</CurrPlayer>
          {gameStatus ? (
            <GameStatus>
              <GameOverMsg>Game Over!!!</GameOverMsg>The{" "}
              {state.player === "white" ? "black" : "white"} Player wins
              <NewGameBtn onClick={resetGame}>New Game</NewGameBtn>
            </GameStatus>
          ) : null}
        </GameDetailsBox>
        <Board state={state} />
        <TakenFiguresBox>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#64341b",
            }}
          >
            Taken figures{" "}
          </h2>
          <TakenFigures>
            {takenFigures.map((figure, index) => {
              return (
                <TakenFigure
                  key={index}
                  style={{
                    color: figure.player === "black" ? "black" : "gray",
                  }}
                >
                  {figureDraw[figure.type]}
                </TakenFigure>
              );
            })}
          </TakenFigures>
        </TakenFiguresBox>
      </GameWrapper>
    </AppBox>
  );
}

function Board({ state }) {
  const { figuresBoard, handleClick, path, check, pickedCell } = state;

  const drawBoard = (figuresBoard) => {
    const board = new Array(8).fill(new Array(8).fill());
    return board.map((row, row_index) => {
      return (
        <BoardRows key={row_index}>
          {row.map((col, col_index) => {
            let cell_number = row_index + "" + col_index;
            let cell_background = (row_index + col_index) % 2 === 0;
            let figure_color = figuresBoard[cell_number]?.player;
            let figure = figuresBoard[cell_number]?.type;
            let figureSign = figureDraw[figure] ? figureDraw[figure] : "";
            let cellInPath = path ? path[cell_number] : "";
            let checkCell = check === cell_number;
            let pickedBorder = cell_number === pickedCell;
            return (
              <BoardColumns
                key={col_index}
                background={cell_background}
                // figureColor={figure_color}
                onClick={() => handleClick(cell_number)}
              >
                <FigurePathHint cellInPath={cellInPath}>
                  <Figure
                    figureColor={figure_color}
                    checkCell={checkCell}
                    pickedBorder={pickedBorder}
                  >
                    {figureSign}
                  </Figure>
                </FigurePathHint>
              </BoardColumns>
            );
          })}
        </BoardRows>
      );
    });
  };
  return <BoardWrapper>{drawBoard(figuresBoard)}</BoardWrapper>;
}
