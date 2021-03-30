import React, { useContext } from "react";
import { MyContext } from "../../context/Context";
import { resetGame } from "../../utils";
import { GameOverMsg, NewGameBtn } from "../gameDetails/GameDetails.styles";
import { ModalInfo, ModalWrapper } from "./Modal.styles";

export default function Modal() {
  const {
    state: { gameStatus, player },
  } = useContext(MyContext);

  return gameStatus ? (
    <ModalWrapper>
      <ModalInfo>
        <GameOverMsg>Game Over!!!</GameOverMsg>The{" "}
        {player === "white" ? "black" : "white"} Player wins
        <NewGameBtn onClick={resetGame}>Click For New Game</NewGameBtn>
      </ModalInfo>
    </ModalWrapper>
  ) : null;
}
