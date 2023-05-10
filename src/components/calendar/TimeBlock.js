import { unparseDurationMinutes } from "@/utils/duration";
import { he } from "date-fns/locale";
import React, { useState } from "react";

function insertNewlines(text) {
  return text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
}

function getForegroundColor(hexBackgroundColor) {
  // Convert the hex color to RGB
  const rgb = hexToRgb(hexBackgroundColor);

  // Calculate the luminance of the background color
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  // Return either black or white based on the luminance value
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}


function generateColorSeed(str) {
  // Initialize the hash variable to 0
  let hash = 0;

  // Loop through each character in the input string
  for (let i = 0; i < str.length; i++) {
    // Get the Unicode code point for the current character
    const code = str.codePointAt(i);

    // Multiply the hash by 31 and add the code point
    hash = (hash * 31 + code) % 4294967296;
  }

  // Convert the hash value to a hexadecimal string with leading zeros
  const hexString = ('000000' + hash.toString(16)).substr(-6);

  // Return the hexadecimal color string
  return '#' + hexString;
}


function hexToRgbA(hex, a) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return `rgba(${((c >> 16) & 255)}, ${((c >> 8) & 255)}, ${(c & 255)}, ${a})`;
  }
  throw new Error('Bad Hex');
}

const TimeBlock = ({ timeBlock, selected = false, initialDateTime, pixelPerMilisecondScale, selectTimeBlock, calendarOptions }) => {
  const { id, startDateTime, endDateTime, spentOn } = timeBlock;
  // const [isEditing, setIsEditing] = useState(false);
  // const [isHovering, setIsHovering] = useState(false);

  // const handleUpdate = (updatedTimeBlock) => {
  //   onUpdate(updatedTimeBlock);
  //   setIsEditing(false);
  // };

  const topPosition = (startDateTime - initialDateTime) * pixelPerMilisecondScale;
  const height = (endDateTime - startDateTime) * pixelPerMilisecondScale - 3; // minus 3px for border

  // if less than a minute, don't show
  if (endDateTime - startDateTime < 1000 * 60) { 
    return null;
  }

  const color = generateColorSeed(spentOn);
  return (
    <div
      onClick={() => selectTimeBlock(timeBlock)}
      style={{
        position: calendarOptions.stackView ? null : 'absolute',
        top: `${topPosition}px`,
        width: "100%",
        background: hexToRgbA(color, selected ? 1 : 0.5),
        borderTop: "3px solid " + color,
        overflow: "hidden",
        ...(calendarOptions.stackView ? {minHeight: height} : {height: height}),
        zIndex: 33,
        color: getForegroundColor(color),
        fontSize: '13px',
        backdropFilter: 'blur(3px)',

        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        // flexDirection: 'column',
      }}
    >
      < div style={{ margin: '3px'}}>
    {(!calendarOptions.stackView || timeBlock.durationSum !== undefined) && <div>
      {calendarOptions.stackView
        ? `(${unparseDurationMinutes(timeBlock.durationSum / 1000 / 60)        }) ${spentOn}`
        : `(${unparseDurationMinutes((endDateTime - startDateTime) / 1000 / 60)}) ${spentOn}`
      }
    </div>}
    <div style={{
      marginTop: '5px'
    }}>
      {timeBlock.memo && insertNewlines(timeBlock.memo)}
    </div>
      </div>
    </div>
  );
};

export default TimeBlock;