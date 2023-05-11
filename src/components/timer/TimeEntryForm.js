import { listTimeBlocks } from "@/pages/api/db";
import { min } from "date-fns";
import React, { useEffect, useState } from "react";
import Select from 'react-select/creatable';

const TimeEntryForm = ({ onActivityChange, onModeChange, activity, minView }) => {
  const [pastActivities, setPastActivities] = useState([]);

  useEffect(() => {
    const fetchPastActivities = async () => {
      setPastActivities([...new Set((await listTimeBlocks()).map(tb => tb.spentOn))]);
    };

    fetchPastActivities();
  }, []);

  const handleActivityChange = ({ value: val }) => {
    onActivityChange(val);
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      flex: 1,
    }}>
      <form
        style={{
          display: "flex",
          flexDirection: minView ? "row" : "column",
          alignItems: "center",
          gap: "1rem",
          marginBottom: !minView && "1rem"
        }}
      >
        <label>
          <Select
            value={{value: activity, label: activity}}
            options={pastActivities.map(a => ({value: a, label: a}))}
            onChange={handleActivityChange}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                minWidth: '200px',
              }),
            }}
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