import React, { useEffect } from "react";
import useTimer from "../../hooks/useTimer";
import { AddTimeIcon, RunningTimer, TimerBox } from "./Timer.styles";

export default function Timer({
  currentPlayer,
  timerOwner,
  initialTimerMinutes = 5,
  setGameStatusOver,
  gameReset,
  resetGameReset,
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
      resetGameReset();
    }
    console.log("os");
    console.log(isPlayerOwner);
    // if (!isPlayerOwner) return () => handleTimeAddition(10);
    // return () => {
    //   if (isPlayerOwner) {
    //     handleTimeAddition(10);
    //   }
    // };
  }, [isPlayerOwner, gameReset]);

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
