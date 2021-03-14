import React, { useContext } from "react";
import { MyContext } from "../../context/Context";
import Figure from "../Figure/Figure";
import {
  BoardColumns,
  BoardRows,
  BoardWrapper,
  FigurePathHint,
} from "./Board.styles";

export default function Board({ hints }) {
  const { state } = useContext(MyContext);
  const { figuresBoard, handleClick, path, check, pickedCell } = state;

  const drawBoard = (figuresBoard) => {
    const board = new Array(8).fill(new Array(8).fill());
    return board.map((row, row_index) => {
      return (
        <BoardRows key={row_index}>
          {row.map((_, col_index) => {
            let cell_number = `${row_index}${col_index}`;
            let cell_background = (row_index + col_index) % 2 === 0;
            const { type, player } = figuresBoard[cell_number] || {};
            let cellInPath = path ? path[cell_number] : "";
            let checkCell = check === cell_number;
            let pickedBorder = cell_number === pickedCell;
            return (
              <BoardColumns
                key={col_index}
                background={cell_background}
                onClick={() => handleClick(cell_number)}
              >
                <FigurePathHint cellInPath={cellInPath} hints={hints}>
                  <Figure
                    colorByPlayer={player}
                    symbol={type}
                    checkCell={checkCell}
                    pickedBorder={pickedBorder}
                  />
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
