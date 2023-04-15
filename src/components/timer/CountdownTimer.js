import { getTimer, setTimer } from "@/pages/api/db";
import React, { useState, useEffect } from "react";

const CountdownTimer = ({ onCreateTimeBlock, activity, setActivity }) => {
  const [duration, setDuration] = useState(30 * 60);
  const [remaining, setRemainingState] = useState(duration);
  const [timerActive, setTimerActiveState] = useState(false);
  const [startDateTime, setStartDateTimeState] = useState(null);

  // set reamining and write to DB
  let setRemaining = async (value) => {
    const due = Math.floor((Date.now() + value * 1000) / 1000);
    await setTimer({
      name: 'count-down-timer',
      due,
    });
    setRemainingState(value);
  }

  // set timer active and write to DB
  let setTimerActive = async (isActive) => {
    await setTimer({ 
      name: 'count-down-timer',
      isActive,
      activity,
    });
    setTimerActiveState(isActive);
  }

  // set start date time and write to DB
  let setStartDateTime = async (value) => {
    await setTimer({
      name: 'count-down-timer',
      start: value,
    });
    setStartDateTimeState(value);
  }

  // Sync internal state with DB
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

  // when user changes duration on the UI
  const handleDurationChange = async (e) => {
    const newDuration = new Number(e.target.value) * 60;
    setDuration(newDuration);
    await setRemaining(newDuration);
  };

  // when user clicks start
  const handleStart = async () => {
    await setRemaining(remaining);
    await setStartDateTime(Math.floor(Date.now() / 1000));
    await setTimerActive(true);
  };

  // when user clicks stop
  const handleStop = async () => {
    if ((await getTimer({ name: 'count-down-timer' })).isActive) {
      await setTimerActive(false);
      onCreateTimeBlock({ 
        startDateTime: startDateTime * 1000,
        endDateTime: Date.now(),
        spentOn: activity 
      });
    } else {
      setTimerActiveState(false);
    }
  };

  // when user clicks reset
  const handleReset = async () => {
    await setRemaining(duration);
  }

  // when component mounts, sync internal state with DB
  useEffect(() => {
    fetchTimerFromDB();
  }, []);

  // if we are counting down, update remaining state
  useEffect(() => {
    if (timerActive && remaining > 0) {
      const timerId = setTimeout(() => setRemainingState(remaining - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (!timerActive) {
      return;
    } else {
      handleStop().then(() => setTimeout(() => new window.Audio('/notify.wav').play(), 1000));
    }
  }, [timerActive, remaining, handleStop]);

  // if we are counting down, check that hour state is in sync with DB
  useEffect(() => {
    (async () => {
      if (!(await getTimer({ name: 'count-down-timer' })).isActive && timerActive) {
          setTimerActive(false);
      }
    })();
  }, [remaining]);

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
        <button onClick={() => location.reload()}>Refresh</button>
      </p>
    </div>
  );
};

export default CountdownTimer;