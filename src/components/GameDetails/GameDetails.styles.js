import styled from "styled-components";
import { FaChessQueen } from "react-icons/fa";

const GameDetailsBox = styled.div`
  position: relative;
  box-shadow: 2px 4px 15px 5px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 15px 0;
  margin-left: 10px;
  text-align: center;
  color: white;
  @media (max-width: 960px) {
    grid-row: 2;
  }
  @media (min-width: 960px) {
    height: 50vh;
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
  color: white;
  cursor: pointer;
`;
const PlayerTurnSymbol = styled(FaChessQueen)`
  color: ${(props) => props.color};
  font-size: 30px;
  margin-bottom: 10px;
  border-bottom: ${(props) => `2px solid ${props.color}`};
  padding: 3px;
`;

const ShowPathHintsBox = styled.div`
  position: absolute;
  bottom: 0;
  margin-bottom: 5px;
  width: 100%;
  text-align: center;
`;

const TimersBlock = styled.div`
  height: 35%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 4px 15px 5px rgba(0, 0, 0, 0.5);
  @media (max-width: 960px) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    grid-gap: 50px;
  }
`;

export {
  GameDetailsBox,
  CurrPlayer,
  GameStatus,
  GameOverMsg,
  NewGameBtn,
  PlayerTurnSymbol,
  ShowPathHintsBox,
  TimersBlock,
};
