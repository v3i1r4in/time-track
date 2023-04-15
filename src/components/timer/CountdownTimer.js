import { getTimer, setTimer } from "@/pages/api/db";
import React, { useState, useEffect } from "react";

const CountdownTimer = ({ onCreateTimeBlock, activity, setActivity }) => {
  const [duration, setDuration] = useState(30 * 60);
  const [remaining, setRemainingState] = useState(duration);
  const [timerActive, setTimerActiveState] = useState(false);
  const [startDateTime, setStartDateTimeState] = useState(null);

  let setRemaining = async (value) => {
    const due = Math.floor((Date.now() + value * 1000) / 1000);
    await setTimer({
      name: 'count-down-timer',
      due,
    });
    setRemainingState(value);
  }

  let setTimerActive = async (isActive) => {
    await setTimer({ 
      name: 'count-down-timer',
      isActive,
      activity,
    });
    setTimerActiveState(isActive);
  }

  let setStartDateTime = async (value) => {
    await setTimer({
      name: 'count-down-timer',
      start: value,
    });
    setStartDateTimeState(value);
  }

  const fetchTimerFromDB = async () => {
    const timer = await getTimer({ name: 'count-down-timer' });
    if (timer) {
      const dueDate = timer.due;
      const now = Date.now() / 1000;
      const remaining = Math.max(0, Math.floor((dueDate - now)));
      if (timer.isActive) {
        setActivity(timer.activity.toString());
        setStartDateTimeState(timer.start);
        setRemainingState(remaining);
        setTimerActiveState(true);
      }
    }
  }

  const handleDurationChange = async (e) => {
    const newDuration = new Number(e.target.value) * 60;
    setDuration(newDuration);
    await setRemaining(newDuration);
  };

  const handleStart = async () => {
    await setStartDateTime(Math.floor(Date.now() / 1000));
    await setTimerActive(true);
  };

  const handleStop = async () => {
    await setTimerActive(false);
    const endDateTime = Math.floor(Date.now() / 1000);
    onCreateTimeBlock({ startDateTime, endDateTime, spentOn: activity });
  };

  const handleReset = async () => {
    await setRemaining(duration);
  }

  useEffect(() => {
    fetchTimerFromDB();
  }, []);

  useEffect(() => {
    if (timerActive && remaining > 0) {
      const timerId = setTimeout(() => setRemaining(remaining - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (!timerActive) {
      return;
    } else {
      handleStop().then(() => setTimeout(() => new window.Audio('/notify.wav').play(), 1000));
    }
  }, [timerActive, remaining, handleStop]);

  return (
    <div>
      <div style={{ fontSize: '30pt' }}>{Math.floor(remaining / 60).toString().padStart(2, "0")}:{(remaining % 60).toString().padStart(2, "0")}</div>
      <select onChange={handleDurationChange}>
        <option value="30">30m</option>
        <option value="60">1h</option>
        <option value="90">1.5h</option>
        <option value="120">2h</option>
        <option value="0.1">6s</option>
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