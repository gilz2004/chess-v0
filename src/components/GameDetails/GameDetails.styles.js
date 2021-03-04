import styled from "styled-components";
import { FaChessQueen } from "react-icons/fa";

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
const PlayerTurnSymbol = styled(FaChessQueen)`
  color: ${(props) => props.color};
  font-size: 30px;
  margin-bottom: 10px;
  border-bottom: ${(props) => `2px solid ${props.color}`};
  padding: 3px;
`;

export {
  GameDetailsBox,
  CurrPlayer,
  GameStatus,
  GameOverMsg,
  NewGameBtn,
  PlayerTurnSymbol,
};
