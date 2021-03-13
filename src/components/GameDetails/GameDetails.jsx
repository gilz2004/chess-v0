import React from "react";
import Timer from "../Timer/Timer";
import {
  CurrPlayer,
  GameDetailsBox,
  GameOverMsg,
  GameStatus,
  NewGameBtn,
  PlayerTurnSymbol,
  ShowPathHintsBox,
} from "./GameDetails.styles";

export default function GameDetails({
  player,
  gameStatus,
  resetGame,
  hints,
  setHints,
}) {
  return (
    <GameDetailsBox>
      <h2>Game details</h2>
      <Timer currentPlayer={player} timerOwner="black" />
      <CurrPlayer>
        <PlayerTurnSymbol color={player === "white" ? "white" : "black"} />
        <span>player turn</span>
      </CurrPlayer>
      {gameStatus ? (
        <GameStatus>
          <GameOverMsg>Game Over!!!</GameOverMsg>The{" "}
          {player === "white" ? "black" : "white"} Player wins
          <NewGameBtn onClick={resetGame}>New Game</NewGameBtn>
        </GameStatus>
      ) : null}
      <Timer currentPlayer={player} timerOwner="white" />
      <ShowPathHintsBox>
        Show path hints?{" "}
        <input
          type="checkbox"
          checked={hints}
          onChange={(e) => setHints(e.target.checked)}
        />
      </ShowPathHintsBox>
    </GameDetailsBox>
  );
}
