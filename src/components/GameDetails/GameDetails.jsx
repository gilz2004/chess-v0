import React from "react";
import {
  CurrPlayer,
  GameDetailsBox,
  GameOverMsg,
  GameStatus,
  NewGameBtn,
  PlayerTurnSymbol,
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
      <div
        style={{
          position: "absolute",
          bottom: "0",
          marginBottom: "5px",
          width: "100%",
          textAlign: "center",
        }}
      >
        Show path hints?{" "}
        <input
          type="checkbox"
          checked={hints}
          onChange={(e) => setHints(e.target.checked)}
        />
      </div>
    </GameDetailsBox>
  );
}
