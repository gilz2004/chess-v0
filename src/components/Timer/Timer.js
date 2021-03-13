import React from "react";
import useTimer from "../../hooks/useTimer";
import { AddTimeIcon, TimerBox } from "./Timer.styles";

export default function Timer({ currentPlayer, timerOwner }) {
  const { timerFormatted, timerColor, handleTimeAddition } = useTimer(
    currentPlayer,
    timerOwner
  );
  let isPlayerOwner = currentPlayer === timerOwner;
  return (
    <>
      <TimerBox isPlayerOwner={isPlayerOwner} timerColor={timerColor}>
        <span>{timerFormatted}</span>
        {timerOwner !== currentPlayer ? (
          <AddTimeIcon onClick={handleTimeAddition}>+</AddTimeIcon>
        ) : null}
      </TimerBox>
    </>
  );
}
