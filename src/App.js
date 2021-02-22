import React from "react";
import styled from "styled-components";
import "./app.styles.css";
import { figureDraw } from "./boardEssentials";
import useGame from "./useGame";

const Title = styled.h1`
  text-align: center;
  margin: 20px 0;
`;

const GameWrapper = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr 250px;
  height: 95vh;
  grid-gap: 20px;
`;

const BoardWrapper = styled.div`
  border: 3px solid black;
  height: 100%;
  display: grid;
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
  min-width: 55px;
  min-height: 55px;
  font-weight: 600;
  background: ${(props) => (props.background ? "#D8AD8D" : "#78492F")};
  color: ${(props) => (props.figureColor === "white" ? "white" : "black")};
`;

const Figure = styled.div`
  font-size: ${(props) => (props.checkCell ? "40px" : "35px")};
  font-weight: ${(props) => (props.checkCell ? "900" : "400")};
`;

const FigurePathHint = styled.div`
  border: ${(props) => (props.cellInPath ? "2px solid red" : "none")};
  border-radius: 10px;
  width: 85%;
  height: 85%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function App() {
  const state = useGame();

  return (
    <>
      <Title>Chess Game</Title>
      <GameWrapper>
        <div>
          <h3>Game details here</h3>
          <p>{state.player} player turn</p>
        </div>
        <Board state={state} />
        <div>Taken figures here</div>
      </GameWrapper>
    </>
  );
}

function Board({ state }) {
  const { figuresBoard, handleClick, path, check } = state;
  // console.log("path in app ", path);
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
            return (
              <BoardColumns
                key={col_index}
                background={cell_background}
                figureColor={figure_color}
                onClick={() => handleClick(cell_number)}
              >
                <FigurePathHint cellInPath={cellInPath}>
                  <Figure checkCell={checkCell}>{figureSign}</Figure>
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
