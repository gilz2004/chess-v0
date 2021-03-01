import { FaChessKing, FaChessBishop, FaChessKnight } from "react-icons/fa";
import {
  GiChessRook,
  GiChessQueen,
  GiChessPawn,
  GiChessKnight,
} from "react-icons/gi";

export const piecesObject = {
  "00": { type: "rook", player: "black" },
  "01": { type: "knight", player: "black" },
  "02": { type: "bishop", player: "black" },
  "03": { type: "queen", player: "black" },
  "04": { type: "king", player: "black" },
  "05": { type: "bishop", player: "black" },
  "06": { type: "knight", player: "black" },
  "07": { type: "rook", player: "black" },
  10: { type: "pawn", player: "black" },
  11: { type: "pawn", player: "black" },
  12: { type: "pawn", player: "black" },
  13: { type: "pawn", player: "black" },
  14: { type: "pawn", player: "black" },
  15: { type: "pawn", player: "black" },
  16: { type: "pawn", player: "black" },
  17: { type: "pawn", player: "black" },
  60: { type: "pawn", player: "white" },
  61: { type: "pawn", player: "white" },
  62: { type: "pawn", player: "white" },
  63: { type: "pawn", player: "white" },
  64: { type: "pawn", player: "white" },
  65: { type: "pawn", player: "white" },
  66: { type: "pawn", player: "white" },
  67: { type: "pawn", player: "white" },
  70: { type: "rook", player: "white" },
  71: { type: "knight", player: "white" },
  72: { type: "bishop", player: "white" },
  73: { type: "queen", player: "white" },
  74: { type: "king", player: "white" },
  75: { type: "bishop", player: "white" },
  76: { type: "knight", player: "white" },
  77: { type: "rook", player: "white" },
};

// export const figureDraw = {
//   rook: "♖",
//   knight: "♘",
//   bishop: "♗",
//   king: "♔",
//   queen: "♕",
//   pawn: "♙",
// };
export const figureDraw = {
  rook: <GiChessRook />,
  knight: <FaChessKnight />,
  bishop: <FaChessBishop />,
  king: <FaChessKing />,
  queen: <GiChessQueen />,
  pawn: <GiChessPawn />,
};
