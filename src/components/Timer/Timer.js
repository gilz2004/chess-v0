import React, { useEffect } from "react";
import useTimer from "../../hooks/useTimer";
import { AddTimeIcon, RunningTimer, TimerBox } from "./Timer.styles";

export default function Timer({
  currentPlayer,
  timerOwner,
  initialTimerMinutes = 5,
}) {
  const { runTimer, timerFormatted, timerColor, handleTimeAddition } = useTimer(
    currentPlayer,
    timerOwner,
    initialTimerMinutes
  );
  let isPlayerOwner = currentPlayer === timerOwner;
  //todo : use run game to update the state that time is up, and game over
  //build a global context
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
