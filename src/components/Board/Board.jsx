import React from "react";
import { figureDraw } from "../../boardEssentials";
import {
  BoardColumns,
  BoardRows,
  BoardWrapper,
  Figure,
  FigurePathHint,
} from "./Board.styles";

export default function Board({ state, hints }) {
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
            let enableBorderShadow = figureSign ? true : false;
            return (
              <BoardColumns
                key={col_index}
                background={cell_background}
                onClick={() => handleClick(cell_number)}
              >
                <FigurePathHint cellInPath={cellInPath} hints={hints}>
                  <Figure
                    enableBorderShadow={enableBorderShadow}
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
