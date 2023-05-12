import React, { useEffect, useRef, useState } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import DayColumn from "./DayColumn";
import TimeForm from "./TimeForm";
import DatePicker from "./DatePicker";
import Head from 'next/head';
import NoSSR from "../NoSSR";
import { getStartOfTheDay } from "@/utils";

const Calendar = () => {
  const smallestScale = 1 / (1000 * 80);
  const largestScale = 1 / (500);
  const [date, setDate] = useState(getStartOfTheDay(new Date()));
  const [pixelPerMilisecondScale, setPixelPerMilisecondScale] = useState(smallestScale);
  const scrollContainerRef = useRef();
  const [scrollTop, setScrollTop] = useState(0);
  const [selectedTimeBlock, setSelectedTimeBlock] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0.123123);
  const [calendarOptions, setCalendarOptions] = useState({
    stackView: false,
    sizeReflectDuration: true,
  });
  const [numberOfDays, setNumberOfDays] = useState(1);

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
    setNumberOfDays(Math.floor(scrollContainerRef.current.offsetWidth / 200) || 1);
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

  if (numberOfDays == 1) {
    days = [date];
  } else if (numberOfDays == 2) {
    days = [
      addDays(new Date(date.getTime()), -1),
      date
    ];
  } else {
    days = [...Array(numberOfDays)].map((_, index) => addDays(new Date(date.getTime()), index - numberOfDays + 2));
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
                key={day.getDate() + ''}
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
                selectedDate={date}
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