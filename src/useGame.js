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

  const handleClick = (cell_number) => {
    //No cell picked yet
    if (!pickedCell) {
      if (player !== figuresBoard[cell_number]?.player) return;
      let path = buildFigurePath(cell_number);
      console.log("path", path);
      setState({ ...state, pickedCell: cell_number, path });
      //if the player want to change picked cell
    } else if (pickedCell && pickedCell === cell_number)
      setState({ ...state, pickedCell: "", path: {} });
    else {
      const newFigureBoard = move(cell_number);
      setState({
        ...state,
        figuresBoard: newFigureBoard,
        pickedCell: "",
        player: swapPlayer(),
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

  function buildFigurePath(cell_number) {
    let { type, player } = figuresBoard[cell_number];
    const figures_list = {
      pawn: () => pawnPathBuild(cell_number, player),
      knight: () => "knight",
      bishop: () => buildBishopPath(cell_number),
      rook: () => buildRookPath(cell_number),
      queen: () => "queen",
      king: () => "king",
    };
    return figures_list[type]();
  }

  const pawnPathBuild = (cell_number, player) => {
    console.log("pawwn");
    const players_types = {
      //   white: whitePawnMove(cell_number),
      black: () => {},
    };
    return players_types[player];
  };

  let topAndLeftBorder = 0;
  let bottomAndRightBorder = 7;

  const buildRookPath = (cellNumber) => {
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
    //todo: add the current cell number here.
    // let aaa =
    return Object.values(movements).reduce((acc, movement) => {
      acc = { ...acc, ...checkPathValidation(movement()) };
      return acc;
    }, {});

    // console.log("aaaaaaaaaaaaaa", aaa);
  };

  const buildBishopPath = (cellNumber) => {
    let curr_row = parseInt(cellNumber / 10);
    let curr_col = parseInt(cellNumber) % 10;

    let goUpLeft = tryBuildPath({
      operation: (index) => ({
        nextRow: curr_row - index,
        nextCol: curr_col - index,
      }),
    });

    let goDownLeft = tryBuildPath({
      operation: (index) => ({
        nextRow: curr_row + index,
        nextCol: curr_col - index,
      }),
    });

    let goUpRight = tryBuildPath({
      operation: (index) => ({
        nextRow: curr_row - index,
        nextCol: curr_col + index,
      }),
    });

    let goDownRight = tryBuildPath({
      operation: (index) => ({
        nextRow: curr_row + index,
        nextCol: curr_col + index,
      }),
    });
  };

  function checkCellValidPosition(row, col) {
    //out of range
    if (row > bottomAndRightBorder || row < topAndLeftBorder) return false;
    else if (col > bottomAndRightBorder || col < topAndLeftBorder) return false;
    //in range
    return true;
  }

  const tryBuildPath = ({ operation }) => {
    let path = [];
    let index = 1;
    let maxLoops = 8;
    while (maxLoops >= 0) {
      let { nextRow, nextCol } = operation(index);
      if (!checkCellValidPosition(nextRow, nextCol)) {
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

  const checkPathValidation = (pathArray) => {
    //array of object:
    let stopScanning = false;
    const figurePath = pathArray.reduce((acc, cell_in_path) => {
      const { player: figurePlayer, type, cell } = cell_in_path;
      if (stopScanning) return acc;
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

  return {
    ...state,
    handleClick,
  };
}
