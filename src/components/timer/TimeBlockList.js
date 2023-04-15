import React from "react";

const TimeBlockList = ({ timeBlocks, deleteTimeBlock }) => {
  const formatDuration = (start, end) => {
    const duration = end - start;
    const hours = Math.floor(duration / 1000/ 3600);
    const minutes = Math.floor((duration / 1000 % 3600) / 60);
    const seconds = (duration / 1000) % 60;
    return `${
      hours 
        ? `${hours}h` 
        : ''
    }${
      minutes 
        ? `${hours ? ' ' : ''}${minutes}m` 
        : ''
    }${
      !hours && !minutes 
        ? `${seconds}s`
        : ''
      }`;
  };
  return (
    <div>
      <ul>
      </ul>
      <table style={{borderCollapse: 'collapse'}}>
        <thead>
          {timeBlocks.map((timeBlock, index) => (
            <tr key={index} style={{ }}>
              <td  style={{ border: '1px solid black', padding: '5px'}}>
                {new Date(timeBlock.startDateTime).getHours().toString().padStart(2, "0")}:
                {new Date(timeBlock.startDateTime).getMinutes().toString().padStart(2, "0")}
              </td>
              <td style={{ border: '1px solid black', padding: '5px'}}>{timeBlock.spentOn}</td>
              <td  style={{ border: '1px solid black', padding: '5px'}}>{formatDuration(timeBlock.startDateTime, timeBlock.endDateTime)}</td>
              <td  style={{ border: '1px solid black', padding: '5px'}}><button onClick={() => deleteTimeBlock(timeBlock)}>X</button></td>
            </tr>
          ))}
        </thead>
      </table>
    </div>
  );
};

export default TimeBlockList;