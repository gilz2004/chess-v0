import React, { useEffect } from "react";
import useTimer from "../../hooks/useTimer";
import { AddTimeIcon, RunningTimer, TimerBox } from "./Timer.styles";

export default function Timer({ currentPlayer, timerOwner }) {
  const { timerFormatted, timerColor, handleTimeAddition } = useTimer(
    currentPlayer,
    timerOwner
  );
  let isPlayerOwner = currentPlayer === timerOwner;

  useEffect(() => {
    return () => {
      if (isPlayerOwner) {
        handleTimeAddition(10);
      }
    };
  }, [isPlayerOwner]);

  return (
    <>
      <TimerBox isPlayerOwner={isPlayerOwner} timerColor={timerColor}>
        <RunningTimer>{timerFormatted}</RunningTimer>
        {!isPlayerOwner ? (
          <AddTimeIcon onClick={() => handleTimeAddition()}>+</AddTimeIcon>
        ) : null}
      </TimerBox>
    </>
  );
}
