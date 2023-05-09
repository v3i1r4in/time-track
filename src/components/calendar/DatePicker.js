import React from 'react';

const DatePicker = ({date, setDate, calendarOptions, setCalendarOptions}) => {
  const handleDateChange = (event) => {
    setDate(new Date(event.target.value));
  };

  return (
    <div style={{ 
        display: 'flex', 
        justifyContent: 
        'center', 
        alignItems: 'center',
        marginTop: '4px',
        padding: '4px',
        border: '1px solid #000',
        borderRadius: '5px',
    }}>
        <input
        type="date"
        value={date.toISOString().substring(0, 10)}
        onChange={handleDateChange}
        />
        {/* checkbox */}
        <div style={{ marginLeft: '5px' }}>
          <label>
            <input
              type="checkbox"
              checked={calendarOptions.stackView}
              onChange={(event) => setCalendarOptions({...calendarOptions, stackView: event.target.checked})}
            />
            Stack View
          </label>
        </div>
    </div>
  );
};

export default DatePicker;