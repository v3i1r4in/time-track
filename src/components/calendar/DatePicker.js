import React from 'react';

const DatePicker = ({date, setDate}) => {
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
    </div>
  );
};

export default DatePicker;