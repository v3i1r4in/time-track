import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { listTimeBlocks, upsertTimeBlock } from "@/pages/api/db";
import TimeBlock from "./TimeBlock";
import Calendar from "./Calendar";

const DayColumn = ({
    date,
    hourOffset = 5,
    // pixelPerMilisecondScale = 2 / (1000 * 60), // default scale is 1 pixel per minute
    pixelPerMilisecondScale = 1 / (1000 * 10), // default scale is 1 pixel per minute
    showTimeValue = false,
    scrollTop,
    containerHeight,
    reloadFlag = 0.123123,
    selectTimeBlock,
    selectedTimeBlock,
    calendarOptions,
}) => {
    /** Zooming */
    const [timeBlocks, setTimeBlocks] = useState([]);
    const ref = useRef();

    const miliOffeset = hourOffset * 60 * 60 * 1000;

    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime() + miliOffeset;
    const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 0).getTime() + miliOffeset;

    const loadTimeBlocks = async () => {
        setTimeBlocks(await listTimeBlocks(
            startDate,
            endDate
        ));
    };

    useEffect(() => {
        loadTimeBlocks();
    }, [reloadFlag]);

    const isToday = new Date().toDateString() === date.toDateString();

    // Time Grid Lines
    let hours = 24;
    let multiplier = 2

    let drawQuarterHourLines = pixelPerMilisecondScale >= 1 / (1000 * 10);
    let drawMinuteLines = pixelPerMilisecondScale >= 1 / (1000 * 3);

    if (drawQuarterHourLines) {
        multiplier = 4;
    }

    if (drawMinuteLines) {
        multiplier = 60;
    }

    const handleDoubleClick = async (event) => {
        const parentRect = ref.current.getBoundingClientRect();
        const top = event.clientY - parentRect.top;
        // convert top to time
        const time = startDate + top / pixelPerMilisecondScale;

        await upsertTimeBlock({
            startDateTime: time,
            endDateTime: time + 1000 * 60 * 30,
            spentOn: "Unkown",
        });

        await loadTimeBlocks();
    };

    let lines = hours * multiplier;
    const heightPerLine = pixelPerMilisecondScale * 1000 * 60 * 60 * 24 / lines;

    const generateTimeGrid = (isSidebar) => {
        const timeGrid = [];
        for (let i = 0; i < lines; i++) {
            let isHourLine = i % multiplier === 0;
            let isHalfHourLine = i % (multiplier / 2) === 0;
            let isQuarterHourLine = i % (multiplier / 4) === 0;
            let isMinuteLine = i % (multiplier / 60) === 0;
    
            let lineColor = null;
            if (isSidebar) {
                if (isHourLine) {
                    lineColor = "#000";
                } else if (isHalfHourLine) {
                    lineColor = "#AAA";
                } else if (isQuarterHourLine) {
                    lineColor = "#CCC";
                } else if (isMinuteLine) {
                    lineColor = "#EEE";
                }
            } else {
                if (isHourLine) {
                    lineColor = "#BBB";
                } else if (isHalfHourLine) {
                    lineColor = "#EEE";
                } else if (isQuarterHourLine) {
                    lineColor = "#EEE";
                } else if (isMinuteLine) {
                    lineColor = "#EEE";
                }
            }
    
            let timeHour = (hourOffset + Math.floor(i / multiplier)) % 24;
            let timeMinute = Math.floor(i % multiplier) * Math.floor(60 / multiplier);
    
            let currentTime = startDate + (i / multiplier) * 60 * 60 * 1000;
            let nextTime = startDate + ((i + 1) / multiplier) * 60 * 60 * 1000;
    
            let backgroundColor = null;
    
    
            if (isSidebar) {
                if (nextTime < Date.now()) {
                    backgroundColor = "#bbb";
                } else if (currentTime < Date.now()) {
                    backgroundColor = "#ddd";
                }
            }
    
            // if (containerHeight) {
            //     if (i * heightPerLine < scrollTop - 1000 || i * heightPerLine > scrollTop + containerHeight + 1000) {
            //         continue;
            //     }
            // }
    
            timeGrid.push(
                <div
                    key={`timeLine-${i}`}
                    style={{
                        top: `${i * heightPerLine}px`,
                        // top: '0px',
                        position: "absolute",
                        height: `${heightPerLine}px`,
                        width: "100%",
                        borderTop: `1px solid ${lineColor}`,
                        // color: '#ddd',
                        zIndex: 1,
                        backgroundColor: backgroundColor,
                    }}
                >
                    {isSidebar && <>{timeHour.toString().padStart(2, '0')}:{timeMinute.toString().padStart(2, '0')}</>}
                </div>
            );
        }
        return timeGrid;
    }

    let timeBlocksSorted = [...timeBlocks]
    if (calendarOptions.stackView) {

        // sort time blocks by spentOn and startDateTime
        timeBlocksSorted.sort((a, b) => {
            if (a.spentOn < b.spentOn) {
                return -1;
            } else if (a.spentOn > b.spentOn) {
                return 1;
            } else {
                if (a.startDateTime < b.startDateTime) {
                    return -1;
                } else if (a.startDateTime > b.startDateTime) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });

        // group time blocks by spentOn
        const timeBlocksBySpentOn = {};
        timeBlocksSorted.forEach((timeBlock) => {
            if (!timeBlocksBySpentOn[timeBlock.spentOn]) {
                timeBlocksBySpentOn[timeBlock.spentOn] = [];
            }
            timeBlocksBySpentOn[timeBlock.spentOn].push(timeBlock);
        });

        // compute sum of time durations for each spent on
        const timeBlockDurationsBySpentOn = {};
        Object.keys(timeBlocksBySpentOn).forEach((spentOn) => {
            timeBlockDurationsBySpentOn[spentOn] = timeBlocksBySpentOn[spentOn].reduce((sum, timeBlock) => {
                return sum + (timeBlock.endDateTime - timeBlock.startDateTime);
            }, 0);
        });

        // add duration sum to the first appearance of each spentOn
        timeBlocksSorted.forEach((timeBlock) => {
            if (timeBlockDurationsBySpentOn[timeBlock.spentOn]) {
                timeBlock.durationSum = timeBlockDurationsBySpentOn[timeBlock.spentOn];
                delete timeBlockDurationsBySpentOn[timeBlock.spentOn];
            }
        });
    }

    return (
        <>
        {
            showTimeValue && !calendarOptions.stackView && <div style={{
                width: `56px`,
                position: "relative",
                height: `${heightPerLine * lines}px`,
                borderLeft: "none",
            }}>
                {generateTimeGrid(true)}
            </div>
        }
        <div style={{
            width: calendarOptions.stackView ? (100 / 7) + "%" : `calc(${100 / 7}% - 8px)`,
            position: "relative",
            height: `${heightPerLine * lines}px`,
            borderLeft: "1px solid #000",
        }}
            onDoubleClick={handleDoubleClick}
            ref={ref}
        >

            <h5
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 200,
                    backgroundColor: isToday ? "#444" : "#eee",
                    margin: 0,
                    padding: "5px",
                    color: isToday ? "#fff" : "#000",
                    // boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.2)",
                    borderBottom: "1px solid #000",
                    // borderRadius: "5px",
                    marginBottom: "0px",
                }}
            >{format(date, "EEE MMM dd")}</h5>
            <div>
                {!calendarOptions.stackView && generateTimeGrid()}
            </div>
            <div>
                {timeBlocksSorted.map((timeBlock) => <TimeBlock calendarOptions={calendarOptions} key={timeBlock.id + '-'} selected={selectedTimeBlock?.id === timeBlock.id} selectTimeBlock={selectTimeBlock} timeBlock={timeBlock} initialDateTime={startDate} pixelPerMilisecondScale={pixelPerMilisecondScale} />)}
            </div>
        </div>
        </>
    );
};

export default DayColumn;