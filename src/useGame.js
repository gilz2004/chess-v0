import { useState } from "react";
import { piecesObject } from "./boardEssentials";

let testMode = false;

const initialState = {
  player: "white",
  takenFigures: [],
  figuresBoard: piecesObject,
  path: {},
  // testMode:false,
  pickedCell: "",
};

export default function useGame() {
  const [state, setState] = useState(initialState);
  const { figuresBoard, player, pickedCell, path } = state;

  function canFigureMove(cellNumber) {
    //set test mode on.
    testMode = true;
    //get opponent figures
    let updatedFiguresBoard = { ...figuresBoard };
    delete updatedFiguresBoard[cellNumber];

    const opponentCells = Object.keys(updatedFiguresBoard).reduce(
      (acc, cell) => {
        if (updatedFiguresBoard[cell].player !== player) {
          acc[cell] = { ...updatedFiguresBoard[cell], cell };
        }
        return acc;
      },
      {}
    );
    console.log("updatedFiguresBoard", updatedFiguresBoard);

    const oppPath = Object.values(opponentCells).reduce((acc, opponentCell) => {
      acc = { ...acc, ...buildFigurePath(opponentCell.cell) };
      return acc;
    }, {});
    delete oppPath[cellNumber];
    console.log("oppPath", oppPath);
    // delete oppPath[cellNumber];
    // console.log("after delete oppPath", oppPath);
    //check if opponent figures can get to the king
    //search for the curr player king -> make a function

    // let kingInOpponentsPath = Object.values(oppPath).find((pathCell) => {
    // console.log("pathCell", pathCell);
    // return pathCell.type === "king" && pathCell.player === player;
    // });
    // console.log("kingInPath", kingInOpponentsPath);

    //set test mode = false
    testMode = false;
    // if (kingInOpponentsPath) return false;
    return true;
    //test mode - status when i test if the opponent figure can get to the curr player king
  }

  const handleClick = (cellNumber) => {
    //No cell picked yet
    if (!pickedCell) {
      if (player !== figuresBoard[cellNumber]?.player) return;
      if (!canFigureMove(cellNumber)) return;
      else {
        let path = buildFigurePath(cellNumber);
        setState({ ...state, pickedCell: cellNumber, path });
      }
      //if the player want to change picked cell
    } else if (pickedCell && pickedCell === cellNumber)
      setState({ ...state, pickedCell: "", path: {} });
    else {
      if (!isCellInPath(cellNumber)) return;
      const newFigureBoard = move(cellNumber);
      setState({
        ...state,
        figuresBoard: newFigureBoard,
        pickedCell: "",
        player: swapPlayer(),
        path: {},
      });
      // let pr2 = performance.now();
    }
  };

  const isCellInPath = (cell) => path[cell];

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
    const curr_player = figuresBoard[cellNumber].player;
    let curr_row = parseInt(cellNumber / 10);
    let curr_col = parseInt(cellNumber) % 10;
    let firstRowMove = curr_player === "white" ? curr_row - 1 : curr_row + 1;
    let secondRowMove =
      curr_player === "white" ? firstRowMove - 1 : firstRowMove + 1;
    let newCellNumber = firstRowMove + "" + curr_col;
    let cell = {
      ...figuresBoard[newCellNumber],
      cell: newCellNumber,
    };
    //moves build path:
    let possibleMoves = [];
    //check if this move is pawn the pawn first move.
    if (figuresBoard[cellNumber] === piecesObject[cellNumber]) {
      possibleMoves.push(cell);
      newCellNumber = secondRowMove + "" + curr_col;
      cell = { ...figuresBoard[newCellNumber], cell: newCellNumber };
      possibleMoves.push(cell);
    }
    //not first move;
    else possibleMoves.push(cell);
    let movesPath = checkPathValidation(possibleMoves, { pawnFigure: true });
    //pawn take over cells from here...
    let takeOverPossibleMoves = pawnTakeOverMoves(firstRowMove, curr_col);
    return { ...movesPath, ...takeOverPossibleMoves };
  };

  const pawnTakeOverMoves = (row, col) => {
    let takeOverPossibleCells = {
      prevToCurrCell: row + "" + (col - 1),
      nextToCurrCell: row + "" + (col + 1),
    };
    return Object.values(takeOverPossibleCells).reduce((acc, cellNumber) => {
      if (isOpponentFound(cellNumber))
        acc = {
          ...acc,
          [cellNumber]: { ...figuresBoard[cellNumber], cell: cellNumber },
        };
      return acc;
    }, {});
  };

  const isOpponentFound = (cell) => {
    if (!figuresBoard[cell]) return false;
    if (figuresBoard[cell].player !== player) return true;
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
        acc[queenPathCell] = { cell: queenPathCell };
      else if (
        kingCol + 1 === queenCol &&
        (kingRow + 1 === queenRow || kingRow - 1 === queenRow)
      )
        acc[queenPathCell] = { cell: queenPathCell };
      else if (
        kingCol - 1 === queenCol &&
        (kingRow - 1 === queenRow || kingRow + 1 === queenRow)
      )
        acc[queenPathCell] = { cell: queenPathCell };

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
          let newCellNumber = nextRow + "" + nextCol;
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
    return checkPathValidation(knightPossiblePath, { removeScanning: true });
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
    let path = new Array(8);
    let index = 1;
    let maxLoops = 8;
    while (maxLoops >= 0) {
      let { nextRow, nextCol } = operation(index);
      if (!cellOnBoardValid(nextRow, nextCol)) break; // or better to add return;
      let cell = nextRow + "" + nextCol;
      path.push({ ...figuresBoard[cell], cell });
      maxLoops--;
      index++;
    }
    return path;
  };

  //removeScanning for knight, he has the ability to jump over other figures
  const checkPathValidation = (pathArray, specialCase = {}) => {
    let { removeScanning, pawnFigure } = specialCase;
    //array of object:
    let stopScanning = false;
    const figurePath = pathArray.reduce((acc, cell_in_path) => {
      const { player: figurePlayer, type, cell } = cell_in_path;
      //change to check the opponent positioning path
      let curr_player = testMode
        ? player === "white"
          ? "black"
          : "white"
        : player;

      if (!removeScanning && stopScanning) return acc;
      //same player can't overlap my player
      else if (figurePlayer === curr_player) {
        stopScanning = true;
        return acc;
      }
      //Opponent figure, add to path and stop scanning
      else if (figurePlayer && figurePlayer !== curr_player && !pawnFigure) {
        console.log("smk");
        acc[cell] = { ...cell_in_path };
        stopScanning = true;
        return acc;
      } else {
        //someone in the pawn move path,prevent the pawn to move forward.
        if (pawnFigure && figuresBoard[cell]) {
          stopScanning = true;
        } else acc[cell] = { ...cell_in_path };
      }
      return acc;
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
//problems: 1 black  knight can overtake his figures.= fixed
//2 paint the current picked cell in color, so the user may know who he picked
