import { unparseDurationMinutes } from "@/utils/duration";
import React, { useState } from "react";

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

const TimeBlock = ({ timeBlock, selected = false, initialDateTime, pixelPerMilisecondScale, selectTimeBlock }) => {
  const { id, startDateTime, endDateTime, spentOn } = timeBlock;
  // const [isEditing, setIsEditing] = useState(false);
  // const [isHovering, setIsHovering] = useState(false);

  // const handleUpdate = (updatedTimeBlock) => {
  //   onUpdate(updatedTimeBlock);
  //   setIsEditing(false);
  // };

  const topPosition = (startDateTime - initialDateTime) * pixelPerMilisecondScale;
  const height = (endDateTime - startDateTime) * pixelPerMilisecondScale;

  // if less than a minute, don't show
  if (endDateTime - startDateTime < 1000 * 60) { 
    return null;
  }

  const color = generateColorSeed(spentOn);
  return (
    <div
      onClick={() => selectTimeBlock(timeBlock)}
      style={{
        marginBottom: "10px",
        position: "absolute",
        top: `${topPosition}px`,
        width: "100%",
        background: hexToRgbA(color, selected ? 1 : 0.7),
        borderTop: "3px solid " + color,
        overflow: "hidden",
        height: height,
        zIndex: 33,
        color: selected ? '#fff' : '#000',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
    <div>{spentOn}</div>
    <div>{unparseDurationMinutes((endDateTime - startDateTime) / 1000 / 60)}</div>
    </div>
  );
};

export default TimeBlock;