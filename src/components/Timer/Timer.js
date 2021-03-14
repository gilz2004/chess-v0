import React, { useEffect } from "react";
import useTimer from "../../hooks/useTimer";
import { AddTimeIcon, RunningTimer, TimerBox } from "./Timer.styles";

export default function Timer({
  currentPlayer,
  timerOwner,
  initialTimerMinutes = 5,
  setGameStatusOver,
}) {
  const { timerFormatted, timerColor, handleTimeAddition } = useTimer(
    currentPlayer,
    timerOwner,
    initialTimerMinutes,
    setGameStatusOver
  );
  let isPlayerOwner = currentPlayer === timerOwner;

  useEffect(() => {
    return () => {
      handleTimeAddition(10);
    };
  }, [isPlayerOwner]);

  return (
    <>
      <TimerBox isPlayerOwner={isPlayerOwner} timerColor={timerColor}>
        <RunningTimer>{timerFormatted}</RunningTimer>
        <AddTimeIcon onClick={() => handleTimeAddition()}>+</AddTimeIcon>
      </TimerBox>
    </>
  );
}
