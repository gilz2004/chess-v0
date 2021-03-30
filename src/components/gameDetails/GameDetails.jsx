import React, { useContext } from "react";
import { MyContext } from "../../context/Context";
import { resetGame } from "../../utils";
import Timer from "../timer/Timer";
import {
  CurrPlayer,
  GameDetailsBox,
  NewGameBtn,
  PlayerTurnSymbol,
  ShowPathHintsBox,
  TimersBlock,
} from "./GameDetails.styles";

export default function GameDetails({ hints, setHints }) {
  const { state } = useContext(MyContext);
  const { player, setGameStatusOver } = state;

  return (
    <GameDetailsBox>
      <h2>Game details</h2>
      <TimersBlock>
        <Timer
          currentPlayer={player}
          timerOwner="black"
          setGameStatusOver={setGameStatusOver}
        />
        <Timer
          currentPlayer={player}
          timerOwner="white"
          setGameStatusOver={setGameStatusOver}
        />
      </TimersBlock>
      <CurrPlayer>
        <PlayerTurnSymbol color={player === "white" ? "white" : "black"} />
        <span>player turn</span>
      </CurrPlayer>
      <NewGameBtn gameDetailsBorder onClick={resetGame}>
        New Game
      </NewGameBtn>
      <ShowPathHintsBox>
        {/* //add new game btn here */}
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
