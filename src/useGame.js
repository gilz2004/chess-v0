import { useState } from "react";
import { piecesObject } from "./boardEssentials";

const initialState = {
  player: "white",
  takenFigures: [],
  figuresBoard: piecesObject,
  path: {},

  pickedCell: "",
};

export default function useGame() {
  const [state, setState] = useState(initialState);
  const { figuresBoard, player, pickedCell } = state;

  const handleClick = (cellNumber) => {
    //No cell picked yet
    if (!pickedCell) {
      if (player !== figuresBoard[cellNumber]?.player) return;
      let path = buildFigurePath(cellNumber);
      console.log("path", path);
      setState({ ...state, pickedCell: cellNumber, path });
      //if the player want to change picked cell
    } else if (pickedCell && pickedCell === cellNumber)
      setState({ ...state, pickedCell: "", path: {} });
    else {
      const newFigureBoard = move(cellNumber);
      setState({
        ...state,
        figuresBoard: newFigureBoard,
        pickedCell: "",
        player: swapPlayer(),
        path: {},
      });
    }
  };

  function swapPlayer() {
    return player === "white" ? "black" : "white";
  }

  function move(move_to_cell) {
    const newFigureBoard = { ...figuresBoard };
    let pieceToMove = newFigureBoard[pickedCell];
    delete newFigureBoard[pickedCell];
    return { ...newFigureBoard, [move_to_cell]: pieceToMove };
  }

  function buildFigurePath(cellNumber) {
    let { type, player } = figuresBoard[cellNumber];
    const figures_list = {
      pawn: () => pawnPathBuild(cellNumber),
      knight: () => knightPathBuild(cellNumber),
      bishop: () => bishopPathBuild(cellNumber),
      rook: () => rookPathBuild(cellNumber),
      queen: () => queenPathBuild(cellNumber),
      king: () => kingPathBuild(cellNumber),
    };
    return figures_list[type]();
  }

  let topAndLeftBorder = 0;
  let bottomAndRightBorder = 7;

  const pawnPathBuild = (cellNumber) => {
    const curr_player = figuresBoard[cellNumber];
    let curr_row = parseInt(cellNumber / 10);
    let curr_col = parseInt(cellNumber) % 10;
    let firstRowMove = curr_player === "white" ? curr_row + 1 : curr_row - 1;
    let secondRowMove =
      curr_player === "white" ? firstRowMove + 1 : firstRowMove - 1;
    let newCellNumber = firstRowMove + "" + curr_col;
    let cell = {
      ...figuresBoard[newCellNumber],
      cell: newCellNumber,
    };
    console.log("firstRowMove", firstRowMove);
    //moves build path:
    let possibleMoves = [];
    //check if first pawn move
    if (figuresBoard[cellNumber] === piecesObject[cellNumber]) {
      possibleMoves.push(cell);
      newCellNumber = secondRowMove + "" + curr_col;
      cell = { ...figuresBoard[newCellNumber], cell: newCellNumber };
      possibleMoves.push(cell);
    } else {
      possibleMoves.push(cell);
      let takeOverPossibleMoves = [];
      ///check cell position
      //check if opponent in cell

      takeOverPossibleMoves.push();
    }
    return checkPathValidation(possibleMoves);
  };

  const kingPathBuild = (cellNumber) => {
    let kingRow = parseInt(cellNumber / 10);
    let kingCol = parseInt(cellNumber) % 10;

    const queenPath = queenPathBuild(cellNumber);
    return Object.keys(queenPath).reduce((acc, queenPathCell) => {
      let queenRow = parseInt(queenPathCell / 10);
      let queenCol = parseInt(queenPathCell) % 10;
      if (
        kingCol === queenCol &&
        (kingRow - 1 === queenRow || kingRow + 1 === queenRow)
      )
        acc[queenPathCell] = queenPathCell;
      else if (
        kingCol + 1 === queenCol &&
        (kingRow + 1 === queenRow || kingRow - 1 === queenRow)
      )
        acc[queenPathCell] = queenPathCell;
      else if (
        kingCol - 1 === queenCol &&
        (kingRow - 1 === queenRow || kingRow + 1 === queenRow)
      )
        acc[queenPathCell] = queenPathCell;

      return acc;
    }, {});
  };

  const queenPathBuild = (cellNumber) => {
    return { ...rookPathBuild(cellNumber), ...bishopPathBuild(cellNumber) };
  };

  const knightPathBuild = (cellNumber) => {
    let currentRow = parseInt(cellNumber / 10);
    let currentCol = parseInt(cellNumber) % 10;
    let movements = {
      upLeftV1: { nextRow: currentRow - 2, nextCol: currentCol - 1 },
      upLeftV2: { nextRow: currentRow - 1, nextCol: currentCol - 2 },
      upRightV1: { nextRow: currentRow - 2, nextCol: currentCol + 1 },
      upRightV2: { nextRow: currentRow - 1, nextCol: currentCol + 2 },
      downLeftV1: { nextRow: currentRow + 2, nextCol: currentCol - 1 },
      downLeftV2: { nextRow: currentRow + 1, nextCol: currentCol - 2 },
      downRightV1: { nextRow: currentRow + 2, nextCol: currentCol + 1 },
      downRightV2: { nextRow: currentRow + 1, nextCol: currentCol + 2 },
    };

    let knightPossiblePath = Object.values(movements).reduce(
      (acc, movement) => {
        let { nextRow, nextCol } = movement;
        if (cellOnBoardValid(nextRow, nextCol)) {
          let newCellNumber = parseInt(nextRow + "" + nextCol);
          let cell = {
            ...figuresBoard[newCellNumber],
            cell: nextRow + "" + nextCol,
          };
          acc.push(cell);
        }
        return acc;
      },
      []
    );
    return checkPathValidation(knightPossiblePath, true);
  };

  const rookPathBuild = (cellNumber) => {
    let curr_row = parseInt(cellNumber / 10);
    let curr_col = parseInt(cellNumber) % 10;
    //This will run automatically
    let movements = {
      goUp: () =>
        tryBuildPath({
          operation: (index) => ({
            nextRow: curr_row - index,
            nextCol: curr_col,
          }),
        }),
      goDown: () =>
        tryBuildPath({
          operation: (index) => ({
            nextRow: curr_row + index,
            nextCol: curr_col,
          }),
        }),
      goLeft: () =>
        tryBuildPath({
          operation: (index) => ({
            nextRow: curr_row,
            nextCol: curr_col - index,
          }),
        }),
      goRight: () =>
        tryBuildPath({
          operation: (index) => ({
            nextRow: curr_row,
            nextCol: curr_col + index,
          }),
        }),
    };
    //todo: add the current cell number here?
    // let aaa =
    return buildValidPath(movements);
  };

  const bishopPathBuild = (cellNumber) => {
    let curr_row = parseInt(cellNumber / 10);
    let curr_col = parseInt(cellNumber) % 10;
    let movements = {
      goUpLeft: () =>
        tryBuildPath({
          operation: (index) => ({
            nextRow: curr_row - index,
            nextCol: curr_col - index,
          }),
        }),

      goDownLeft: () =>
        tryBuildPath({
          operation: (index) => ({
            nextRow: curr_row + index,
            nextCol: curr_col - index,
          }),
        }),
      goUpRight: () =>
        tryBuildPath({
          operation: (index) => ({
            nextRow: curr_row - index,
            nextCol: curr_col + index,
          }),
        }),
      goDownRight: () =>
        tryBuildPath({
          operation: (index) => ({
            nextRow: curr_row + index,
            nextCol: curr_col + index,
          }),
        }),
    };

    return buildValidPath(movements);
  };

  function cellOnBoardValid(row, col) {
    //out of range
    if (row > bottomAndRightBorder || row < topAndLeftBorder) return false;
    else if (col > bottomAndRightBorder || col < topAndLeftBorder) return false;
    //in range
    return true;
  }

  const tryBuildPath = ({ operation, config = null }) => {
    let path = [];
    let index = 1;
    let maxLoops = 8;
    while (maxLoops >= 0) {
      let { nextRow, nextCol } = operation(index);
      if (!cellOnBoardValid(nextRow, nextCol)) {
        console.log("not valid cell");
        break; // or better to add return;
      }
      let cell = nextRow + "" + nextCol;
      path.push({ ...figuresBoard[cell], cell });

      maxLoops--;
      index++;
    }
    return path;
  };

  //removeScanning for knight, he has the ability to jump over other figures
  const checkPathValidation = (pathArray, removeScanning = false) => {
    //array of object:
    let stopScanning = false;
    const figurePath = pathArray.reduce((acc, cell_in_path) => {
      const { player: figurePlayer, type, cell } = cell_in_path;
      if (!removeScanning && stopScanning) return acc;
      //same player can't overlap my player
      else if (figurePlayer === player) {
        stopScanning = true;
        return acc;
      }
      //Opponent figure, add to path and stop scanning
      else if (figurePlayer && figurePlayer !== player) {
        acc[cell] = { ...cell_in_path };
        stopScanning = true;
        return acc;
      } else {
        acc[cell] = { ...cell_in_path };
        return acc;
      }
    }, {});
    return figurePath;
  };

  const buildValidPath = (movements) => {
    return Object.values(movements).reduce((acc, movement) => {
      acc = { ...acc, ...checkPathValidation(movement()) };
      return acc;
    }, {});
  };

  return {
    ...state,
    handleClick,
  };
}
///todo:
//problems: 1 black  knight can overtake his figures.
//2 paint the current picked cell in color, so the user may know who he picked
