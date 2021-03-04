import React, { useState } from "react";

import "./app.styles.css";
import Board from "./components/Board/Board.jsx";
import TakenFigures from "./components/TakenFigures/TakenFigures.jsx";
import GameDetails from "./components/GameDetails/GameDetails.jsx";

import Header from "./components/Header/Header.jsx";
import { AppBox, GameWrapper } from "./global-styles/App.styles";
import useGame from "./hooks/useGame";

export default function App() {
  const [hints, setHints] = useState(true);
  const state = useGame();
  const { gameStatus, takenFigures, resetGame, player } = state;
  return (
    <AppBox>
      <Header />
      <GameWrapper>
        <GameDetails
          player={player}
          gameStatus={gameStatus}
          resetGame={resetGame}
          hints={hints}
          setHints={setHints}
        />
        <Board state={state} hints={hints} />
        <TakenFigures takenFigures={takenFigures} />
      </GameWrapper>
    </AppBox>
  );
}

//todo: when socket will be used change underline to active link.
//  TODO : MOVE HINTS TO USE GAME
