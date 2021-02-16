import { useState } from "react";
import { piecesObject } from "./boardEssentials";

const initialState = {
  player: "white",
  takenFigures: [],
  figuresBoard: piecesObject,
  path: {},

  pickedCell: "",
  tryBoard: createTryBoard(),
};

function createTryBoard() {
  const board = new Array(8).fill(new Array(8).fill(""));
  return board.map((row, row_index) => {
    return row.map((col, col_index) => {
      let cell_number = row_index + "" + col_index;
      return { ...piecesObject[cell_number] };
    });
  });
}

export default function useGame() {
  const [state, setState] = useState(initialState);
  const { figuresBoard, player, pickedCell } = state;
  console.log("try", state.tryBoard);
  const handleClick = (cell_number) => {
    //No cell picked yet
    if (!pickedCell) {
      if (player !== figuresBoard[cell_number]?.player) return;
      let path = buildFigurePath(cell_number);
      console.log("path", path);
      setState({ ...state, pickedCell: cell_number });
      //if the player want to change picked cell
    } else if (pickedCell && pickedCell === cell_number)
      setState({ ...state, pickedCell: "" });
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
      pawn: pawnPathBuild(cell_number, player),
      knight: () => "knight",
      bishop: () => "bishop",
      rook: () => "rook",
      queen: () => "queen",
      king: () => "king",
    };
    return figures_list[type];
  }

  const pawnPathBuild = (cell_number, player) => {
    const players_types = {
      white: whitePawnMove(cell_number),
      black: () => {},
    };
    return players_types[player];
  };

  const whitePawnMove = (cell_number) => {
    let first_move_cells = [];
    let take_over_cell = [];
    let cell_move_by = 10;
    let cell_number_int = parseInt(cell_number);
    console.log("in pawn", cell_number, typeof cell_number);
    //This pawn didn't moved yet, so it will be his first move.
    if (!figuresBoard[cell_number].alreadyMoved) {
      first_move_cells.push(cell_number_int - cell_move_by);
      first_move_cells.push(cell_number_int - cell_move_by * 2);
    }
    take_over_cell.push(cell_number_int - cell_move_by);
    take_over_cell.push(cell_number_int - cell_move_by - 1);
    take_over_cell.push(cell_number_int - cell_move_by + 1);

    console.log(
      "first_move_cells",
      first_move_cells,
      "take_over_cell",
      take_over_cell
    );
  };

  return {
    ...state,
    handleClick,
  };
}
