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
  color: ${(props) => (props.figureColor === "white" ? "#2f3542" : "black")};
`;

const FigureWrapper = styled.div`
  font-size: 35px;
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
  const { figuresBoard, handleClick } = state;

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

            return (
              <BoardColumns
                key={col_index}
                background={cell_background}
                figureColor={figure_color}
                onClick={() => handleClick(cell_number)}
              >
                <FigureWrapper>{figureSign}</FigureWrapper>
              </BoardColumns>
            );
          })}
        </BoardRows>
      );
    });
  };

  return <BoardWrapper>{drawBoard(figuresBoard)}</BoardWrapper>;
}
