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

  useEffect(() => {
    const containerElement = scrollContainerRef.current;
    containerElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      containerElement.removeEventListener("wheel", handleWheel, { passive: false });
    };
  }, [handleWheel]);

  useEffect(() => {
    const containerElement = scrollContainerRef.current;
    containerElement.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      containerElement.removeEventListener("wheel", handleWheel, { passive: false });
    };
  }, [handleWheel]);

  useEffect(() => {
    handleScroll();
  }, []);

  const startWeek = startOfWeek(date, { weekStartsOn: 1 });
  const days = [...Array(7)].map((_, index) => addDays(startWeek, index));

  let containerHeight = scrollContainerRef.current?.clientHeight;

  return (
    <NoSSR>
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: 'calc(100vh - 12px)',
      }}>
        <div style={{
          flex: 1,
          display: "flex",
          overflow: 'scroll',
          border: '1px solid #000',
          borderRadius: '5px',
        }}
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
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
            />
          ))}
        </div>
        <div >
          {selectedTimeBlock ? <TimeForm onDataChange={reload} timeBlock={selectedTimeBlock} key={selectedTimeBlock.id || 'none'}></TimeForm> : <DatePicker date={date} setDate={setDate} />}
        </div>

      </div>
    </NoSSR>
  );
};

export default Calendar;