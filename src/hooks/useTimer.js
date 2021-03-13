import { useEffect, useState } from "react";

const initialTimer = { minute: 4, second: 60 };
let timerWarningNumber = 30;

export default function useTimer(player, timerOwner) {
  const [timer, setTimer] = useState(initialTimer);
  const [timerColor, setTimerColor] = useState(timerOwner);
  const [runTimer, setRunTimer] = useState(true);

  const { minute, second } = timer;

  const handleTimer = () => {
    //not first move, then for each move add 15 seconds auto
    // console.log(minute !== initialTimer.minute, second !== initialTimer.second);
    // if (minute !== initialTimer.minute && second !== initialTimer.second) {
    //   console.log("not first move");
    //   handleTimeAddition();
    // }
    if (minute === 0 && second === timerWarningNumber) setTimerWarning("red");
    if (minute === 0 && second === 0) return handleTimerReset();
    else if (second === 0) setTimer({ minute: minute - 1, second: 59 });
    else setTimer({ ...timer, second: second - 1 });
    // return handleTimeAddition();
  };

  const setTimerWarning = (color) => setTimerColor(color);

  const formatTime = ({ minute, second }) => {
    //initial condition:
    if (second === 60) return `${minute < 10 ? "0" : ""}${minute + 1} : 00`;
    else if (second === 0 || second < 10)
      return `${minute < 10 ? "0" : ""}${minute} : 0${second}`;
    return `${minute < 10 ? "0" : ""}${minute} : ${second}`;
  };

  const handleTimerReset = () => {
    setTimer((prevTimer) => prevTimer);
    setTimerColor("white");
    setRunTimer(false);
  };

  const handleTimeAddition = () => {
    const secondsToAdd = 15;
    const minutesInHour = 60;

    setTimer((prevTimer) => {
      let secondsAfterAddition = second + secondsToAdd;
      if (secondsAfterAddition >= minutesInHour)
        return {
          minute: minute + 1,
          second: secondsAfterAddition - minutesInHour,
        };
      else if (secondsAfterAddition < minutesInHour)
        return {
          minute: minute,
          second: secondsAfterAddition,
        };
    });
  };

  useEffect(() => {
    if (timerOwner !== player) return;
    if (!runTimer) return;
    const intervalId = setInterval(() => {
      handleTimer();
    }, 1000);
    //clear interval
    return () => clearInterval(intervalId);
  });

  return { timerFormatted: formatTime(timer), timerColor, handleTimeAddition };
}
