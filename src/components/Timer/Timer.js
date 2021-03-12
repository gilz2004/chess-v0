import React from "react";
import useTimer from "../../hooks/useTimer";
import { TimerBox } from "./Timer.styles";

export default function Timer({ player }) {
  const { timer, timerColor, formatSeconds } = useTimer(player);

  let { minute, second } = timer[player];
  return (
    <TimerBox timerColor={timerColor}>
      <span>{minute}</span>
      <span>:{formatSeconds(second)}</span>
    </TimerBox>
  );
}
