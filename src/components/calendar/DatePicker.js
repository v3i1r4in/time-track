import { getStartOfTheDay } from '@/utils';
import React, { useEffect, useState } from 'react';

// // This function will convert a date object to a string in the format 'YYYY-MM-DD',
// // adjusting for timezone.
// function convertToLocalDate(date) {
//   const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
//   return localDate.toISOString().split('T')[0];
// }

// // This function will take a string in the format 'YYYY-MM-DD' and convert it into a date object.
// function convertToUTCDate(dateString) {
//   const [year, month, day] = dateString.split('-');
//   return new Date(Date.UTC(year, month - 1, day));
// }

const DatePicker = ({date, setDate, calendarOptions, setCalendarOptions}) => {
  const [ dateStr, setDateStr ] = useState(date.toISOString().split('T')[0]);


  useEffect(() => {
    const utcDate = new Date(dateStr);
    let dateWithTimeZone  = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
    setDate(getStartOfTheDay(dateWithTimeZone));
  }, [dateStr]);

  // const handleDateChange = (event) => {
  //   setDate(getStartOfTheDay(convertToUTCDate(event.target.value)));
  // };

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
          value={dateStr}
          onChange={e => setDateStr(e.target.value)}
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
        {/* checkbox */}
        <div style={{ marginLeft: '5px' }}>
          <label>
            <input
              disabled={!calendarOptions.stackView}
              type="checkbox"
              checked={!calendarOptions.stackView || calendarOptions.sizeReflectDuration}
              onChange={(event) => setCalendarOptions({...calendarOptions, sizeReflectDuration: event.target.checked})}
            />
            Size Reflect Duration
          </label>
        </div>
    </div>
  );
};

export default DatePicker;