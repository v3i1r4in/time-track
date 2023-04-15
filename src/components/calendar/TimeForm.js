import { deleteTimeBlock, upsertTimeBlock } from '@/pages/api/db';
import React, { useState } from 'react';

const getMinutes = (dateTime) => {
    return (new Date(dateTime)).getMinutes();
}

const getHours = (dateTime) => {
    return (new Date(dateTime)).getHours();
}


const TimeForm = ({ onDataChange, timeBlock }) => {
  const [startTimeHour, setStartTimeHour] = useState(getHours(timeBlock.startDateTime));
  const [startTimeMinute, setStartTimeMinute] = useState(getMinutes(timeBlock.startDateTime));
  const [durationMinutes, setDurationMinutes ] = useState((timeBlock.endDateTime - timeBlock.startDateTime) / 1000 / 60);
  const [spentOn, setSpentOn] = useState(timeBlock.spentOn);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const originalStartDateTime = new Date(timeBlock.startDateTime);
    const newStartDateTime = new Date(originalStartDateTime.getFullYear(), originalStartDateTime.getMonth(), originalStartDateTime.getDate(), startTimeHour, startTimeMinute);
    const newEndDateTime = new Date(newStartDateTime.getTime() + durationMinutes * 60 * 1000);

    const newTimeBlock = {
        ...timeBlock,
        startDateTime: newStartDateTime.getTime(),
        endDateTime: newEndDateTime.getTime(),
        spentOn,
    };

    await upsertTimeBlock(newTimeBlock);
    onDataChange();
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await deleteTimeBlock(timeBlock);
    onDataChange();
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
        display: 'flex', 
        justifyContent: 
        'space-between', 
        alignItems: 'center',
        marginTop: '4px',
        padding: '4px',
        border: '1px solid #000',
        borderRadius: '5px',
    }}>
      <div>
        <label>
          Start Time:
          <input
            type="number"
            min="0"
            max="23"
            value={startTimeHour}
            onChange={(event) => setStartTimeHour(event.target.value)}
            style={{ marginLeft: '5px', width: '60px' }}
          />
          :
          <input
            type="number"
            min="0"
            max="59"
            value={startTimeMinute}
            onChange={(event) => setStartTimeMinute(event.target.value)}
            style={{ marginLeft: '5px', width: '60px' }}
          />
        </label>
        <label style={{ marginLeft: '15px' }}>
          Duration
          <input
            type="number"
            min="1"
            max={`${24 * 60}`}
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            style={{ marginLeft: '5px', width: '60px' }}
          />
        </label>
        <label style={{ marginLeft: '15px' }}>
          Spent On:
          <input
            type="text"
            value={spentOn}
            onChange={(event) => setSpentOn(event.target.value)}
            style={{ marginLeft: '5px' }}
          />
        </label>
      </div>
      <div>
        <button type="submit" style={{ marginRight: '5px' }}>Submit</button>
        <button type="button" style={{ marginRight: '5px' }} onClick={handleDelete}>Delete</button>
        <button type="button" onClick={onDataChange}>Cancel</button>
      </div>
    </form>
  );
};

export default TimeForm;