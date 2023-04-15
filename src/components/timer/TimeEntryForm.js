import { listTimeBlocks } from "@/pages/api/db";
import React, { useEffect, useState } from "react";
import Select from 'react-select/creatable';

const TimeEntryForm = ({ onActivityChange, onModeChange, activity }) => {
  const [pastActivities, setPastActivities] = useState([]);

  useEffect(() => {
    const fetchPastActivities = async () => {
      setPastActivities([...new Set((await listTimeBlocks()).map(tb => tb.spentOn))]);
    };

    fetchPastActivities();
  });

  const handleActivityChange = ({ value: val }) => {
    onActivityChange(val);
  };

  return (
    <div>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "1rem"
        }}
      >
        <label>
          <Select
            value={{value: activity, label: activity}}
            // defaultValue={activity}
            options={pastActivities.map(a => ({value: a, label: a}))}
            onChange={handleActivityChange}
          />
        </label>
        <label>
          <button onClick={e => {
            e.preventDefault()
            onModeChange('countdown')
          }}>Count Down</button>
          <button onClick={e => {
            e.preventDefault()
            onModeChange('countup')
        }}>Count Up</button>
        </label>
      </form>
    </div>
  );
};

export default TimeEntryForm;