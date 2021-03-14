import { useEffect, useState } from "react";

const timerWarningNumber = 30;

export default function useTimer(player, timerOwner, initialTimerMinutes) {
  const initialTimer = { minute: initialTimerMinutes - 1, second: 60 };
  const [timer, setTimer] = useState(initialTimer);
  const [timerColor, setTimerColor] = useState(timerOwner);
  const [runTimer, setRunTimer] = useState(true);

  const { minute, second } = timer;

  const handleTimer = () => {
    if (minute === 0 && second === timerWarningNumber)
      return setTimerWarning("red");
    if (minute === 0 && second === 0) return handleTimerReset();
    else if (second === 0) return setTimer({ minute: minute - 1, second: 59 });
    else {
      return setTimer({ ...timer, second: second - 1 });
    }
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

  const handleTimeAddition = (secondsToAdd = 15) => {
    if (isFirstMove()) return;
    const minutesInHour = 60;
    let secondsAfterAddition = second + secondsToAdd;

    if (secondsAfterAddition >= minutesInHour)
      setTimer({
        minute: minute + 1,
        second: secondsAfterAddition - minutesInHour,
      });
    else if (secondsAfterAddition < minutesInHour)
      setTimer({ ...timer, second: secondsAfterAddition });
  };

  const isFirstMove = () => {
    const { minute, second } = timer;
    if (minute === initialTimer.minute && second === initialTimer.second)
      return true;
    return false;
  };

  useEffect(() => {
    if (timerOwner !== player) return;
    if (!runTimer) return;
    const intervalId = setInterval(() => {
      handleTimer();
    }, 1000);
    //clear interval
    return () => {
      clearInterval(intervalId);
    };
  });

  return {
    runTimer,
    timerFormatted: formatTime(timer),
    timerColor,
    handleTimeAddition,
  };
}
