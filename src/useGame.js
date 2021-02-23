import { useState } from "react";
import { piecesObject } from "./boardEssentials";

const initialState = {
  player: "white",
  takenFigures: [],
  figuresBoard: piecesObject,
  path: {},
  pickedCell: "",
  check: null,
};

export default function useGame() {
  const [state, setState] = useState(initialState);
  const [pathToKing, setPathToKing] = useState([]);
  const { figuresBoard, player, pickedCell, path, check } = state;

  // console.log("pathToKing", pathToKing);

  function isCheck(board, cellNumber) {
    //player is the global player its ok in here.
    let figurePath = buildFigurePath(board, cellNumber, player);
    let opponentKing = searchOpponentKing(figurePath, player);
    if (opponentKing) return { status: true, kingCell: opponentKing.cell };
    return { status: false };
  }

  function canFigureMove(cellNumber) {
    let opponentPlayer = player === "white" ? "black" : "white";
    //  if check
    if (check) {
      //get curr player figures = done!
      //get the path to each figure
      //maybe can pass the path down to handleClick function, and not ask for another path
      const currPlayerCells = Object.keys(figuresBoard).reduce((acc, cell) => {
        if (figuresBoard[cell].player === player)
          acc[cell] = { ...figuresBoard[cell], cell };
        return acc;
      }, {});
      console.log("aloha check", currPlayerCells);
    }

    //if not check :
    //get opponent figures
    // let updatedFiguresBoard = { ...figuresBoard };
    // delete updatedFiguresBoard[cellNumber];

    // const opponentCells = Object.keys(updatedFiguresBoard).reduce(
    //   (acc, cell) => {
    //     if (updatedFiguresBoard[cell].player !== player) {
    //       acc[cell] = { ...updatedFiguresBoard[cell], cell };
    //     }
    //     return acc;
    //   },
    //   {}
    // );

    // const oppPath = Object.values(opponentCells).reduce((acc, opponentCell) => {
    //   acc = {
    //     ...acc,
    //     ...buildFigurePath(
    //       updatedFiguresBoard,
    //       opponentCell.cell,
    //       opponentPlayer
    //     ),
    //   };
    //   return acc;
    // }, {});

    // let kingInOpponentsPath = Object.values(oppPath).find((pathCell) => {
    //   return pathCell.type === "king" && pathCell.player !== opponentPlayer;
    // });

    // if (kingInOpponentsPath) return false;
    // return true;
    return true;
  }

  function searchOpponentKing(path, player) {
    return Object.values(path).find((pathCell) => {
      return pathCell.type === "king" && pathCell.player !== player;
    });
  }

  const handleClick = (cellNumber) => {
    //No cell picked yet
    if (!pickedCell) {
      if (player !== figuresBoard[cellNumber]?.player) return;
      if (!canFigureMove(cellNumber)) return;
      else {
        let path = buildFigurePath(figuresBoard, cellNumber, player);
        setState({ ...state, pickedCell: cellNumber, path });
      }
      //if the player want to change picked cell
    } else if (pickedCell && pickedCell === cellNumber)
      setState({ ...state, pickedCell: "", path: {} });
    else {
      if (!isCellInPath(cellNumber)) return;
      const newFigureBoard = move(cellNumber);
      let { status, kingCell } = isCheck(newFigureBoard, cellNumber);
      // if (isCheck(newFigureBoard, cellNumber)) {
      if (status) {
        console.log("check on the king");
        setState({
          ...state,
          figuresBoard: newFigureBoard,
          pickedCell: "",
          player: swapPlayer(),
          path: {},
          check: kingCell,
        });
      } else {
        setState({
          ...state,
          figuresBoard: newFigureBoard,
          pickedCell: "",
          player: swapPlayer(),
          path: {},
          check: null,
        });
      }
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

  let topAndLeftBorder = 0;
  let bottomAndRightBorder = 7;

  function buildFigurePath(board, cellNumber, player) {
    let { type } = board[cellNumber];

    let curr_row = parseInt(cellNumber / 10);
    let curr_col = parseInt(cellNumber) % 10;

    const figures_list = {
      pawn: () => pawnPathBuild(),
      knight: () => knightPathBuild(),
      bishop: () => bishopPathBuild(),
      rook: () => rookPathBuild(),
      queen: () => queenPathBuild(),
      king: () => kingPathBuild(),
    };

    const pawnPathBuild = () => {
      const curr_player = board[cellNumber].player;

      let firstRowMove = curr_player === "white" ? curr_row - 1 : curr_row + 1;
      let secondRowMove =
        curr_player === "white" ? firstRowMove - 1 : firstRowMove + 1;
      let newCellNumber = firstRowMove + "" + curr_col;
      let cell = {
        ...board[newCellNumber],
        cell: newCellNumber,
      };
      //moves build path:
      let possibleMoves = [];
      //check if this move is pawn the pawn first move.
      if (board[cellNumber] === piecesObject[cellNumber]) {
        possibleMoves.push(cell);
        newCellNumber = secondRowMove + "" + curr_col;
        cell = { ...board[newCellNumber], cell: newCellNumber };
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
            [cellNumber]: { ...board[cellNumber], cell: cellNumber },
          };
        return acc;
      }, {});
    };

    const isOpponentFound = (cell) => {
      if (!board[cell]) return false;
      if (board[cell].player !== player) return true;
    };

    const kingPathBuild = () => {
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

    const queenPathBuild = () => {
      return { ...rookPathBuild(), ...bishopPathBuild() };
    };

    const knightPathBuild = () => {
      // let currentRow = parseInt(cellNumber / 10);

      // let currentCol = parseInt(cellNumber) % 10;
      let movements = {
        upLeftV1: { nextRow: curr_row - 2, nextCol: curr_col - 1 },
        upLeftV2: { nextRow: curr_row - 1, nextCol: curr_col - 2 },
        upRightV1: { nextRow: curr_row - 2, nextCol: curr_col + 1 },
        upRightV2: { nextRow: curr_row - 1, nextCol: curr_col + 2 },
        downLeftV1: { nextRow: curr_row + 2, nextCol: curr_col - 1 },
        downLeftV2: { nextRow: curr_row + 1, nextCol: curr_col - 2 },
        downRightV1: { nextRow: curr_row + 2, nextCol: curr_col + 1 },
        downRightV2: { nextRow: curr_row + 1, nextCol: curr_col + 2 },
      };

      let knightPossiblePath = Object.values(movements).reduce(
        (acc, movement) => {
          let { nextRow, nextCol } = movement;
          if (cellOnBoardValid(nextRow, nextCol)) {
            let newCellNumber = nextRow + "" + nextCol;
            let cell = {
              ...board[newCellNumber],
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

    const rookPathBuild = () => {
      // let curr_row = parseInt(cellNumber / 10);
      // let curr_col = parseInt(cellNumber) % 10;
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

    const bishopPathBuild = () => {
      // let curr_row = parseInt(cellNumber / 10);
      // let curr_col = parseInt(cellNumber) % 10;
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
      else if (col > bottomAndRightBorder || col < topAndLeftBorder)
        return false;
      //in range
      return true;
    }

    const tryBuildPath = ({ operation }) => {
      let path = new Array(8);
      let index = 1;
      let maxLoops = 8;
      while (maxLoops >= 0) {
        let { nextRow, nextCol } = operation(index);
        if (!cellOnBoardValid(nextRow, nextCol)) break; // or better to add return;
        let cell = nextRow + "" + nextCol;
        path.push({ ...board[cell], cell });
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

        if (!removeScanning && stopScanning) return acc;
        //same player can't overlap my player
        else if (figurePlayer === player) {
          stopScanning = true;
          return acc;
        }
        //Opponent figure, add to path and stop scanning
        else if (figurePlayer && figurePlayer !== player && !pawnFigure) {
          acc[cell] = { ...cell_in_path };
          stopScanning = true;
          return acc;
        } else {
          //someone in the pawn move path,prevent the pawn to move forward.
          if (pawnFigure && board[cell]) {
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

    return figures_list[type]();
  }

  return {
    ...state,
    handleClick,
  };
}
///todo:
//problems: 1 black  knight can overtake his figures.= fixed
//2 paint the current picked cell in color, so the user may know who he picked
//3 check for code repetition
