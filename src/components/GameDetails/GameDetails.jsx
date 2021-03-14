import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/Context";
import Timer from "../Timer/Timer";
import {
  CurrPlayer,
  GameDetailsBox,
  GameOverMsg,
  GameStatus,
  NewGameBtn,
  PlayerTurnSymbol,
  ShowPathHintsBox,
  TimersBlock,
} from "./GameDetails.styles";

export default function GameDetails({ hints, setHints }) {
  const { state } = useContext(MyContext);
  const { player, gameStatus, resetBoard, setGameStatusOver } = state;
  const [gameReset, setGameReset] = useState(false);

  const handleGameReset = () => {
    setGameReset(true);
    resetBoard();
  };

  const resetGameReset = () => setGameReset(false);

  return (
    <GameDetailsBox>
      <h2>Game details</h2>
      <TimersBlock>
        <Timer
          currentPlayer={player}
          timerOwner="black"
          setGameStatusOver={setGameStatusOver}
          gameReset={gameReset}
          setGameReset={setGameReset}
          resetGameReset={resetGameReset}
        />
        <Timer
          currentPlayer={player}
          timerOwner="white"
          setGameStatusOver={setGameStatusOver}
          gameReset={gameReset}
          setGameReset={setGameReset}
          resetGameReset={resetGameReset}
        />
      </TimersBlock>
      <CurrPlayer>
        <PlayerTurnSymbol color={player === "white" ? "white" : "black"} />
        <span>player turn</span>
      </CurrPlayer>
      {gameStatus ? (
        <GameStatus>
          <GameOverMsg>Game Over!!!</GameOverMsg>The{" "}
          {player === "white" ? "black" : "white"} Player wins
          <NewGameBtn onClick={handleGameReset}>New Game</NewGameBtn>
        </GameStatus>
      ) : null}
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
