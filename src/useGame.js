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
    //  if check
    if (check) {
      //get curr player figures = done!
      //get the path to each figure
      //maybe can pass the path down to handleClick function, and not ask for another path
      let currPlayerFigures = getAllPlayerFigures(figuresBoard, player);
      // const currPlayerCells = Object.keys(figuresBoard).reduce((acc, cell) => {
      //   if (figuresBoard[cell].player === player)
      //     acc[cell] = { ...figuresBoard[cell], cell };
      //   return acc;
      // }, {});
      console.log("aloha check", currPlayerFigures);
    }

    //if not check :
    let modifiedFiguresBoard = { ...figuresBoard };
    // "remove" the current picked cell from the board,
    //  to see if the king is exposed after the move.
    delete modifiedFiguresBoard[cellNumber];
    let opponentPlayer = player === "white" ? "black" : "white";
    //build a path ( were each opponent figure can move to )
    let opponentFigures = getAllPlayerFigures(
      modifiedFiguresBoard,
      opponentPlayer
    );
    console.log("opp cells", opponentFigures);
    console.log("xyz", pathToKing);
    ///check to see if any figure path have a king in her way
    // let opponentKing = searchOpponentKing(opponentFigures, opponentPlayer);
    // console.log("opponentKing", opponentKing);
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

  function getAllPlayerFigures(board, player) {
    return Object.keys(board).reduce((acc, cell) => {
      if (board[cell].player === player) {
        let path = buildFigurePath(board, cell, player);
        if (!Object.values(path).length) return acc;
        else {
          acc[cell] = { ...path };
        }
      }
      return acc;
    }, {});
  }

  function searchOpponentKing(path, player) {
    return Object.values(path).find((pathCell) => {
      console.log("pp", pathCell);
      return pathCell.type === "king" && pathCell.player !== player;
    });
  }

  const handleClick = (cellNumber) => {
    //No cell picked yet
    if (!pickedCell) {
      if (player !== figuresBoard[cellNumber]?.player) return;
      // if (!canFigureMove(cellNumber)) return;
      // else {
      let path = buildFigurePath(figuresBoard, cellNumber, player);
      setState({ ...state, pickedCell: cellNumber, path });
      // }
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
      let movePath = {};

      //empty cell  = pawn can move
      if (!board[newCellNumber]) {
        //first ever pawn move:
        movePath[newCellNumber] = cell;
        if (board[cellNumber] === piecesObject[cellNumber]) {
          //check if second cell is empty
          newCellNumber = secondRowMove + "" + curr_col;
          if (!board[newCellNumber]) {
            movePath[newCellNumber] = {
              ...board[newCellNumber],
              cell: newCellNumber,
            };
          }
        }
      }
      //pawn take over cells from here...
      let takeOverPossibleMoves = pawnTakeOverMoves(firstRowMove, curr_col);
      return { ...movePath, ...takeOverPossibleMoves };
    };

    const pawnTakeOverMoves = (row, col) => {
      let takeOverPossibleCells = {
        prevToCurrCell: { nextRow: row, nextCol: col - 1 },
        nextToCurrCell: { nextRow: row, nextCol: col + 1 },
      };
      return Object.values(takeOverPossibleCells).reduce((acc, cellNumber) => {
        let { nextRow, nextCol } = cellNumber;
        let cell = nextRow + "" + nextCol;
        if (!cellOnBoardValid(nextRow, nextCol)) return acc;
        else if (isOpponentFound(cell))
          acc = {
            ...acc,
            [cell]: { ...board[cell], cell },
          };
        return acc;
      }, {});
    };

    const isOpponentFound = (cell) => {
      if (!board[cell]) return false;
      if (board[cell].player !== player) return true;
      return false;
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

      return Object.values(movements).reduce((acc, movement) => {
        let { nextRow, nextCol } = movement;
        if (cellOnBoardValid(nextRow, nextCol)) {
          let newCellNumber = nextRow + "" + nextCol;
          // here just check if there is an opponent in dest cell or cell is empty
          if (isOpponentFound(newCellNumber) || !board[newCellNumber]) {
            let cell = {
              ...board[newCellNumber],
              cell: nextRow + "" + nextCol,
            };
            acc[newCellNumber] = { ...cell };
          }
        }
        return acc;
      }, {});
    };

    const rookPathBuild = () => {
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
      let path = {};
      let index = 1;
      let maxLoops = 8;
      while (maxLoops >= 0) {
        let { nextRow, nextCol } = operation(index);
        let cell = nextRow + "" + nextCol;
        if (
          !cellOnBoardValid(nextRow, nextCol) ||
          board[cell]?.player === player
        )
          break;
        else if (!board[cell]) path[cell] = { ...board[cell], cell };
        else if (board[cell].player !== player) {
          path[cell] = { ...board[cell], cell };
          break;
        }
        maxLoops--;
        index++;
      }
      return path;
    };

    //maybe remove this function also

    const buildValidPath = (movements) => {
      return Object.values(movements).reduce((acc, movement) => {
        acc = { ...acc, ...movement() };
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
