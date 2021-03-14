import React, { useState } from "react";
import "./app.styles.css";
import Board from "./components/Board/Board.jsx";
import TakenFigures from "./components/TakenFigures/TakenFigures.jsx";
import GameDetails from "./components/GameDetails/GameDetails.jsx";

import Header from "./components/Header/Header.jsx";
import { AppBox, GameWrapper } from "./global-styles/App.styles";
import Modal from "./components/Modal/Modal";

export default function App() {
  const [hints, setHints] = useState(true);

  return (
    <AppBox>
      <Header />
      <Modal />
      <GameWrapper>
        <GameDetails hints={hints} setHints={setHints} />
        <Board hints={hints} />
        <TakenFigures />
      </GameWrapper>
    </AppBox>
  );
}

//todo: when socket will be used change underline to active link.
//  TODO : MOVE HINTS TO USE GAME
