import React, { useState } from "react";
import { FaChessQueen } from "react-icons/fa";
import styled from "styled-components";
import "./app.styles.css";
import { figureDraw } from "./boardEssentials";
import Header from "./Header";
import useGame from "./useGame";

const AppBox = styled.div`
  height: 100vh;
  background-image: url("/assets/wood-background1.png");
  @media (max-width: 500px) {
    padding: 10px 10px;
  }
`;

const GameWrapper = styled.div`
  display: grid;
  height: 90vh;
  @media (max-width: 960px) {
    grid-template-rows: 1fr 150px 1fr;
    grid-gap: 10px;
  }
  @media (min-width: 960px) {
    grid-template-columns: 200px 1fr 250px;
    grid-gap: 20px;
  }
`;

const BoardWrapper = styled.div`
  border: 5px solid #2b2723;
  -webkit-box-shadow: 2px 4px 19px 5px #000000;
  box-shadow: 2px 4px 19px 5px #000000;
  border-radius: 8px;
  height: 100%;
  display: grid;
  @media (max-width: 960px) {
    grid-row: 1;
  }
`;

const BoardRows = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
`;

const BoardColumns = styled.div`
  border-radius: 1px;
  cursor: pointer;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50px;
  font-weight: 600;
  -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.26);
  box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.26);
  // background: ${(props) => (props.background ? "#D8AD8D" : "#78492F")};
  background-image: ${(props) =>
    props.background
      ? "url(/assets/dark-cell.png)"
      : "url(/assets/light-cell.png)"};
  @media (min-width: 500px) {
    min-width: 55px;
    min-height: 55px;
  }
`;

const Figure = styled.div`
  user-select: none;
  border-radius: 10px;
  color: ${(props) => (props.figureColor === "white" ? "white" : "#1E1E1E")};
  font-size: ${(props) => (props.checkCell ? "42px" : "38px")};
  font-weight: ${(props) => (props.checkCell ? "900" : "400")};
  border: ${(props) => (props.pickedBorder ? "1px solid white" : "none")};
  outline: none;
  @media (max-width: 500px) {
    font-size: ${(props) => (props.checkCell ? "35px" : "25px")};
  }
  &:hover {
    transform: scale(1.2);
  }
`;

const FigurePathHint = styled.div`
  border: ${(props) =>
    props.cellInPath && props.hints ? "2px solid white" : "none"};
  border-radius: 10px;
  width: 85%;
  height: 85%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GameDetailsBox = styled.div`
  position: relative;
  box-shadow: 2px 4px 15px 5px rgba(0, 0, 0, 0.5);
  // border: 3px solid #64341b;
  border-radius: 10px;
  padding: 15px 0;
  margin-left: 10px;
  text-align: center;
  // color: #64341b;
  color: white;
  @media (max-width: 960px) {
    grid-row: 2;
  }
  @media (min-width: 960px) {
    height: 40vh;
  }
`;

const CurrPlayer = styled.p`
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const GameStatus = styled.div`
  margin-top: 20px;
`;

const GameOverMsg = styled.p`
  text-decoration: underline;
  font-size: 18px;
  margin-bottom: 10px;
`;

const NewGameBtn = styled.button`
  padding: 10px;
  background: none;
  margin-top: 20px;
  border-radius: 8px;
  cursor: pointer;
`;

const TakenFiguresBox = styled.div`
  padding: 10px 0;
  @media (max-width: 960px) {
    grid-row: 3;
  }
`;

const TakenFigures = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 50px;
  grid-gap: 5px;
`;

const TakenFigure = styled.li`
  font-size: 32px;
  text-align: center;
`;

const PlayerTurnSymbol = styled(FaChessQueen)`
  color: ${(props) => props.color};
  font-size: 30px;
  margin-bottom: 10px;
  border-bottom: ${(props) => `2px solid ${props.color}`};
  padding: 3px;
`;

export default function App() {
  const [hints, setHints] = useState(true);
  const state = useGame();
  const { gameStatus, takenFigures, resetGame } = state;
  //todo: when socket will be used change underline to active link.
  return (
    <AppBox>
      <Header />
      <GameWrapper>
        <GameDetailsBox>
          <h2>Game details</h2>
          <CurrPlayer>
            <PlayerTurnSymbol
              color={state.player === "white" ? "white" : "black"}
            />
            <span>player turn</span>
          </CurrPlayer>
          {gameStatus ? (
            <GameStatus>
              <GameOverMsg>Game Over!!!</GameOverMsg>The{" "}
              {state.player === "white" ? "black" : "white"} Player wins
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
        <Board state={state} hints={hints} />
        <TakenFiguresBox>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "white",
            }}
          >
            Taken figures{" "}
          </h2>
          <TakenFigures>
            {takenFigures.map((figure, index) => {
              return (
                <TakenFigure
                  key={index}
                  style={{
                    color: figure.player === "black" ? "black" : "white",
                  }}
                >
                  {figureDraw[figure.type]}
                </TakenFigure>
              );
            })}
          </TakenFigures>
        </TakenFiguresBox>
      </GameWrapper>
    </AppBox>
  );
}

function Board({ state, hints }) {
  const { figuresBoard, handleClick, path, check, pickedCell } = state;

  const drawBoard = (figuresBoard) => {
    const board = new Array(8).fill(new Array(8).fill());
    return board.map((row, row_index) => {
      return (
        <BoardRows key={row_index}>
          {row.map((col, col_index) => {
            let cell_number = row_index + "" + col_index;
            let cell_background = (row_index + col_index) % 2 === 0;
            let figure_color = figuresBoard[cell_number]?.player;
            let figure = figuresBoard[cell_number]?.type;
            let figureSign = figureDraw[figure] ? figureDraw[figure] : "";
            let cellInPath = path ? path[cell_number] : "";
            let checkCell = check === cell_number;
            let pickedBorder = cell_number === pickedCell;
            let enableBorderShadow = figureSign ? true : false;
            return (
              <BoardColumns
                key={col_index}
                background={cell_background}
                // figureColor={figure_color}
                onClick={() => handleClick(cell_number)}
              >
                <FigurePathHint cellInPath={cellInPath} hints={hints}>
                  <Figure
                    enableBorderShadow={enableBorderShadow}
                    figureColor={figure_color}
                    checkCell={checkCell}
                    pickedBorder={pickedBorder}
                  >
                    {figureSign}
                    {/* {figureDraw[figure]} */}
                  </Figure>
                </FigurePathHint>
              </BoardColumns>
            );
          })}
        </BoardRows>
      );
    });
  };
  return <BoardWrapper>{drawBoard(figuresBoard)}</BoardWrapper>;
}
