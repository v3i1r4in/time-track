import React from "react";

const TimeBlockList = ({ timeBlocks }) => {
  const formatDuration = (start, end) => {
    const duration = end - start;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
  return (
    <div>
      <ul>
        {timeBlocks.map((timeBlock, index) => (
          <li key={index}>
            {new Date(timeBlock.startDateTime * 1000).toLocaleTimeString()} -{" "}
            {formatDuration(timeBlock.startDateTime, timeBlock.endDateTime)} :{" "}
            {timeBlock.spentOn}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeBlockList;