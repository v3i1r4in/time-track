import React, { useState, useEffect } from "react";

const CountUpTimer = ({ onCreateTimeBlock, activity }) => {
  const [elapsed, setElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [startDateTime, setStartDateTime] = useState(null);

  useEffect(() => {
    if (timerActive) {
      const timerId = setTimeout(() => setElapsed(elapsed + 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timerActive, elapsed]);

  const handleStart = () => {
    setStartDateTime(Date.now());
    setTimerActive(true);
  };

  const handleStop = () => {
    setTimerActive(false);
    const endDateTime = Date.now();
    onCreateTimeBlock({ startDateTime, endDateTime, spentOn: activity });
  };

  const handleClear = () => {
    setElapsed(0);
  }

  return (
    <div>
      <div style={{ fontSize: '30pt' }}>{Math.floor(elapsed / 60)}:{elapsed % 60}</div>
      <p>
        <button disabled={timerActive || !activity} onClick={handleStart}>Start</button>
        <button disabled={!timerActive} onClick={handleStop}>Stop</button>
        <button onClick={handleClear}>Clear</button>
      </p>
    </div>
  );
};

export default CountUpTimer;