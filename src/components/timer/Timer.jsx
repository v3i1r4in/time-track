import React, { useState } from "react";
import TimeEntryForm from "./TimeEntryForm";
import CountdownTimer from "./CountdownTimer";
import CountUpTimer from "./CountUpTimer";
import TimeBlockList from "./TimeBlockList";
import { upsertTimeBlock } from "@/pages/api/db";
import NoSSR from "../NoSSR";

function Timer() {
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [timerMode, setTimerMode] = useState("countdown");
  const [activity, setActivity] = useState("");

  const handleTimeBlockCreation = (timeBlock) => {
    setTimeBlocks([...timeBlocks, timeBlock]);
    upsertTimeBlock(timeBlock);
  };

  const handleModeChange = (newMode) => {
    setTimerMode(newMode);
  };

  const handleActivityChange = (newActivity) => {
    setActivity(newActivity);
  };

  return (
    <div
        className="App"
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            textAlign: "center",
            backgroundColor: "#f5f5f5"
        }}
    >
      <NoSSR>
        <TimeEntryForm
          onActivityChange={handleActivityChange}
          onModeChange={handleModeChange}
          activity={activity}
        />
        {timerMode === "countdown" ? (
          <CountdownTimer
            onCreateTimeBlock={handleTimeBlockCreation}
            activity={activity}
            setActivity={setActivity}
          />
        ) : (
          <CountUpTimer onCreateTimeBlock={handleTimeBlockCreation} activity={activity} setActivity={setActivity} />
        )}
        <TimeBlockList timeBlocks={timeBlocks} />
      </NoSSR>
    </div>
  );
}

export default Timer;