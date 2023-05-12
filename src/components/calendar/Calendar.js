import React, { useEffect, useRef, useState } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import DayColumn from "./DayColumn";
import TimeForm from "./TimeForm";
import DatePicker from "./DatePicker";
import Head from 'next/head';
import NoSSR from "../NoSSR";

const Calendar = () => {
  const smallestScale = 1 / (1000 * 80);
  const largestScale = 1 / (500);
  const [date, setDate] = useState(new Date());
  const [pixelPerMilisecondScale, setPixelPerMilisecondScale] = useState(smallestScale);
  const scrollContainerRef = useRef();
  const [scrollTop, setScrollTop] = useState(0);
  const [selectedTimeBlock, setSelectedTimeBlock] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0.123123);
  const [calendarOptions, setCalendarOptions] = useState({
    stackView: false,
    sizeReflectDuration: true,
  });
  const [calendarMode, setCalendarMode] = useState('week');

  const reload = () => {
    setReloadFlag(Math.random());
    setSelectedTimeBlock(null);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollTop(scrollContainerRef.current.scrollTop);
    }
  };


  const handleWheel = (e) => {
    if (e.altKey) {
      e.preventDefault();
      const zoomFactor = 1.05;
      let newScale = pixelPerMilisecondScale;
      let newScrollTop = scrollTop;

      if (e.deltaY > 0) {
        newScale *= zoomFactor;
        newScrollTop = scrollTop * zoomFactor;
      } else if (e.deltaY < 0) {
        newScale /= zoomFactor;
        newScrollTop = scrollTop / zoomFactor;
      }

      // if newScale is out of bounds, do nothing
      if (newScale < smallestScale || newScale > largestScale) {
        return;
      }

      setPixelPerMilisecondScale(newScale);
      // setScrollTop(newScrollTop);
      scrollContainerRef.current.scrollTop = newScrollTop;
    }
  };

  const handleResize = () => {
    if (scrollContainerRef.current.offsetWidth < 600) {
      setCalendarMode('day');
    } else if (scrollContainerRef.current.offsetWidth < 900) {
      setCalendarMode('3days');
    } else if (scrollContainerRef.current.offsetWidth > 1200) {
      setCalendarMode('9days');
    } else {
      setCalendarMode('week');
    }
  };


  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener("wheel", handleWheel, { passive: false });
      window.removeEventListener('resize', handleResize);
    };
  }, [handleWheel]);

  useEffect(() => {
    handleScroll();
    handleResize();
  }, []);

  let days = [];

  if (calendarMode === 'day') {
    days = [date];
  } else if (calendarMode === '3days') {
    days = [
      addDays(date, -1),
      date,
      addDays(date, 1),
    ];
  } else if (calendarMode === '9days') {
    days = [...Array(9)].map((_, index) => addDays(date, index - 4));
  } else if (calendarMode === 'week') {
    const startWeek = startOfWeek(date, { weekStartsOn: 1 });
    days = [...Array(7)].map((_, index) => addDays(startWeek, index));
  }

  let containerHeight = scrollContainerRef.current?.clientHeight;

  return (
    <NoSSR>
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: '100%',
      }}>
        <div style={{
          flex: 1,
          border: '1px solid #000',
          borderRadius: '5px',
          position: 'relative',
        }}
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          <div style={{
            position: 'absolute',
            top: '0px',
            bottom: '0px',
            left: '0px',
            right: '0px',
            overflow: 'scroll',
            display: "flex",
          }}>
            {days.map((day, index) => (
              <DayColumn
                key={format(day, "yyyy-MM-dd")}
                date={day}
                showTimeValue={index === 0}
                pixelPerMilisecondScale={pixelPerMilisecondScale}
                scrollTop={scrollTop}
                containerHeight={containerHeight}
                selectTimeBlock={setSelectedTimeBlock}
                selectedTimeBlock={selectedTimeBlock}
                reloadFlag={reloadFlag}
                calendarOptions={calendarOptions}
                numberOfColumns={days.length}
              />
            ))}
          </div>
        </div>
        <div style={{
          marginTop: "10px",
        }}>
          {selectedTimeBlock ? <TimeForm onDataChange={reload} timeBlock={selectedTimeBlock} key={selectedTimeBlock.id || 'none'}></TimeForm> : <DatePicker date={date} setDate={setDate} calendarOptions={calendarOptions
          } setCalendarOptions={setCalendarOptions}/>}
        </div>
      </div>
    </NoSSR>
  );
};

export default Calendar;