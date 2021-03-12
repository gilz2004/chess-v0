import { useEffect, useState } from "react";

const initialTimer = {
  white: { minute: 4, second: 59 },
  black: { minute: 4, second: 59 },
};

export default function useTimer(player) {
  const [timer, setTimer] = useState(initialTimer);
  const [timerColor, setTimerColor] = useState("white");
  const [runTimer, setRunTimer] = useState(true);
  let currPlayerTimer = timer[player];
  //   console.log("currPlayerTimer", currPlayerTimer);
  const handleTimer = () => {
    if (currPlayerTimer.minute === 0 && currPlayerTimer.second === 30)
      setTimerWarning("red");
    if (currPlayerTimer.minute === 0 && currPlayerTimer.second === 0)
      return handleTimerReset();
    else if (currPlayerTimer.second === 0)
      setTimer((prevTimer) => {
        return {
          ...prevTimer,
          [player]: {
            minute: currPlayerTimer.minute - 1,
            second: 59,
          },
        };
      });
    else {
      setTimer((prevTimer) => {
        return {
          ...prevTimer,
          [player]: {
            ...currPlayerTimer,
            second: currPlayerTimer.second - 1,
          },
        };
      });
    }
  };

  const setTimerWarning = (color) => setTimerColor(color);

  const formatSeconds = (second) =>
    second === 0 || second < 10 ? `0${second}` : `${second}`;

  const handleTimerReset = () => {
    setTimer((prevTimer) => prevTimer);
    setTimerColor("white");
    setRunTimer(false);
  };

  //for each move, add to the curr player timer 10 seconds
  //move this to a custom hook, each player will have his own timer
  //add an option to player to timer (sort off plus button) witch adds 15 seconds each click

  useEffect(() => {
    if (!runTimer) return;
    const intervalId = setInterval(() => {
      handleTimer();
    }, 1000);
    //clear interval
    return () => clearInterval(intervalId);
  }, [timer, runTimer]);

  return { timer, timerColor, formatSeconds };
}
