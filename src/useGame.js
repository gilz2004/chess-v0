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

let kingsPath = {};

export default function useGame() {
  const [state, setState] = useState(initialState);
  const { figuresBoard, player, pickedCell, path, check } = state;

  function canFigureMove(figuresBoard, cellNumber, player) {
    //This function will return the path, remove the path build from handleClick when a !pickedCell

    let curr_figure_path = buildFigurePath(figuresBoard, cellNumber, player);
    let updatedPath = {};
    let newPath = {};
    let opponentPlayer = player === "white" ? "black" : "white";
    let opponentsCells = Object.keys(figuresBoard).filter(
      (figureBoardCell) =>
        figuresBoard[figureBoardCell]?.player === opponentPlayer
    );

    //even if not check the king path has to be checked for threats
    if (
      figuresBoard[cellNumber].player === player &&
      figuresBoard[cellNumber].type === "king"
    ) {
      let modCurrFigurePath = { ...curr_figure_path };
      Object.values(curr_figure_path).forEach((kingPathCell) => {
        let modBoard = move(kingPathCell.cell, cellNumber);
        //get opponent and scan each opponents figure to see if he can get to the king path
        opponentsCells.forEach((oppCellPath) => {
          let cellFigurePath = buildFigurePath(
            modBoard,
            oppCellPath,
            opponentPlayer
          );
          let kingInCell = searchOpponentKing(cellFigurePath);
          if (kingInCell) {
            let { cell: kingCellNumber } = kingInCell;
            delete modCurrFigurePath[kingCellNumber];
          }
        });
      });
      return modCurrFigurePath;
    }

    //  if check
    if (check) {
      updatedPath = Object.values(curr_figure_path).reduce(
        (acc, figurePathCell) => {
          if (kingsPath[figurePathCell.cell])
            acc[figurePathCell.cell] = { ...figurePathCell };
          return acc;
        },
        {}
      );
      return updatedPath;
    }

    //check to see if the figure can move and not expose the king
    else {
      let updated_curr_figure_path = { ...figuresBoard };
      //"remove" the current figure from the cell.
      delete updated_curr_figure_path[cellNumber];
      //get all opponents figures

      let opponentPosThreatCell = getAllPlayerFigures(
        updated_curr_figure_path,
        opponentPlayer
      );
      if (Object.values(kingsPath).length) {
        console.log("kingsPath", kingsPath);
        console.log("opponentPosThreatCell", opponentPosThreatCell);
        //1 get the cell that threat the king = done
        //add the cell to kings path
        kingsPath = {
          ...kingsPath,
          [opponentPosThreatCell]: { cell: opponentPosThreatCell },
        };
        //check if current picked figure can go to the 1 position and the player is not the same and over take him
        newPath = Object.values(curr_figure_path).reduce(
          (acc, currFigurePathCell) => {
            console.log("blah blah blah", currFigurePathCell);
            //add different player check here also?

            if (kingsPath[currFigurePathCell.cell]) {
              acc[currFigurePathCell.cell] = {
                ...kingsPath[currFigurePathCell.cell],
              };
            }
            return acc;
          },
          {}
        );
        //if not then return empty object as path {} else return the path of the figure to the threat
      }
      //scan path and see if king found
      if (Object.values(newPath).length) {
        console.log("new ", newPath);
        kingsPath = {};
        return newPath;
      }
      // }
      return curr_figure_path;
    }
  }

  //This function will get the curr player figure and his figures paths
  //each key is a figure curr cell and is values has to be the king savers
  function getAllPlayerFigures(board, player) {
    return Object.keys(board).find((cell) => {
      if (board[cell]?.player === player) {
        buildFigurePath(board, cell, player);
        if (Object.values(kingsPath).length) return cell;
      }
      return undefined;
    });
  }

  const searchOpponentKing = (path) =>
    Object.values(path).find((pathCell) => pathCell.type === "king");

  const handleClick = (cellNumber) => {
    //No cell picked yet
    if (!pickedCell) {
      if (player !== figuresBoard[cellNumber]?.player) return;
      // if (!canFigureMove(cellNumber)) return;
      // else {
      let path = canFigureMove(figuresBoard, cellNumber, player);
      console.log("pp", path);
      if (Object.values(path).length) {
        setState({ ...state, pickedCell: cellNumber, path });
      }
      return; //
      // }
      //if the player want to change picked cell
    } else if (pickedCell && pickedCell === cellNumber)
      setState({ ...state, pickedCell: "", path: {} });
    else {
      if (!isCellInPath(cellNumber)) return;
      const newFigureBoard = move(cellNumber);
      //check the next path to see if the figure can threat the king.
      let nextFigurePath = buildFigurePath(newFigureBoard, cellNumber, player);
      let kingInDangerPos = searchOpponentKing(nextFigurePath);
      //scan next figure path for king
      if (kingInDangerPos) {
        //add the current cell that figure moved to as a position that threatening the king.
        kingsPath = {
          ...kingsPath,
          [cellNumber]: { cell: cellNumber },
        };
        setState({
          ...state,
          figuresBoard: newFigureBoard,
          pickedCell: "",
          player: swapPlayer(),
          path: {},
          check: kingInDangerPos.cell,
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
        //after a move reset king path , its ok because the path will be to save the king,
        //if hes in danger
        kingsPath = {};
      }
      // let pr2 = performance.now();
    }
  };

  const isCellInPath = (cell) => path[cell];

  function swapPlayer() {
    return player === "white" ? "black" : "white";
  }

  function move(move_to_cell, moveFromCell = null) {
    let statePickedCell = moveFromCell ? moveFromCell : pickedCell;
    const newFigureBoard = { ...figuresBoard };
    let pieceToMove = newFigureBoard[statePickedCell];
    delete newFigureBoard[statePickedCell];
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
        else if (isOpponentFound(cell)) {
          // if (board[cell].type === "king") kingsPath = { ...kingsPath };
          acc = {
            ...acc,
            [cell]: { ...board[cell], cell },
          };
        }
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
      // let opponentKingStatus = {};
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
          if (board[cell].type === "king") {
            kingsPath = path;
            // setPathToKing(path);
          }

          break;
        }

        maxLoops--;
        index++;
      }
      return path;
    };

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

//4 canFigureMove function newPath part to check it well
//5 how to build a check mate situation
//6 pawn to queen transform
//7 paint current picked figure cell
//8 add taken figures to taken figures array
