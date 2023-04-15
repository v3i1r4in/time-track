import React, { useState, useEffect } from "react";

const CountdownTimer = ({ onCreateTimeBlock, activity }) => {
  const [duration, setDuration] = useState(30 * 60);
  const [remaining, setRemaining] = useState(duration);
  const [timerActive, setTimerActive] = useState(false);
  const [startDateTime, setStartDateTime] = useState(null);

  const handleDurationChange = (e) => {
    const newDuration = new Number(e.target.value) * 60;
    setDuration(newDuration);
    setRemaining(newDuration);
  };

  const handleStart = () => {
    setStartDateTime(Math.floor(Date.now() / 1000));
    setTimerActive(true);
  };

  const handleStop = () => {
    setTimerActive(false);
    const endDateTime = Math.floor(Date.now() / 1000);
    onCreateTimeBlock({ startDateTime, endDateTime, spentOn: activity });
  };

  const handleReset = () => {
    setRemaining(duration);
  }

  useEffect(() => {
    if (timerActive && remaining > 0) {
      const timerId = setTimeout(() => setRemaining(remaining - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (!timerActive) {
      return;
    } else {
      handleStop();
      new window.Audio('/notify.wav').play();
    }
  }, [timerActive, remaining, handleStop]);

  return (
    <div>
      <div style={{ fontSize: '30pt' }}>{Math.floor(remaining / 60)}:{remaining % 60}</div>
      <select onChange={handleDurationChange}>
        <option value="0.1">6s</option>
        <option value="30">30m</option>
        <option value="60">1h</option>
        <option value="90">1.5h</option>
        <option value="120">2h</option>
      </select>
      <p>
        <button disabled={timerActive || !activity || remaining == 0} onClick={handleStart}>Start</button>
        <button disabled={!timerActive} onClick={handleStop}>Stop</button>
        <button onClick={handleReset}>Reset</button>
      </p>
    </div>
  );
};

export default CountdownTimer;