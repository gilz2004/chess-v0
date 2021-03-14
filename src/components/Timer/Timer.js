import React, { useEffect } from "react";
import useTimer from "../../hooks/useTimer";
import { AddTimeIcon, RunningTimer, TimerBox } from "./Timer.styles";

export default function Timer({
  currentPlayer,
  timerOwner,
  initialTimerMinutes = 5,
  setGameStatusOver,
  gameReset,
  setToDefaultGameReset,
}) {
  const {
    resetTimer,
    timerFormatted,
    timerColor,
    handleTimeAddition,
  } = useTimer(
    currentPlayer,
    timerOwner,
    initialTimerMinutes,
    setGameStatusOver
  );
  let isPlayerOwner = currentPlayer === timerOwner;

  useEffect(() => {
    if (gameReset) {
      resetTimer();
      setToDefaultGameReset();
    }
    if (!gameReset)
      return () => {
        handleTimeAddition(10);
      };
  }, [isPlayerOwner, gameReset]);

  return (
    <>
      <TimerBox isPlayerOwner={isPlayerOwner} timerColor={timerColor}>
        <RunningTimer>{timerFormatted}</RunningTimer>
        <AddTimeIcon onClick={() => handleTimeAddition()}>+</AddTimeIcon>
      </TimerBox>
    </>
  );
}
