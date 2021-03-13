import styled from "styled-components";

export const TimerBox = styled.div`
  margin-top: 5px;
  font-size: 1.4em;
  font-family: fantasy;
  letter-spacing: 3.3px;
  color: ${(props) => props.timerColor};
  opacity: ${(props) => (props.isPlayerOwner ? "1" : "0.5")};
`;

export const AddTimeIcon = styled.span`
  // position: absolute;
  // top: 55px;
  // cursor: pointer;
  // right: 53px;
  // color: white;
`;
export const RunningTimer = styled.span`
  min-width: 85px;
  display: inline-block;
`;
