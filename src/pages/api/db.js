// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";

export const config = { rpc: true };

const prisma = new PrismaClient();

const epochSecondsToDate = (epochSeconds) => {
  return epochSeconds * 1000;
};

const dateToEpochSeconds = (date) => {
  return Math.floor(date / 1000);
};

// 1. Upsert function
export async function upsertTimeBlock(data) {
  let { startDateTime, endDateTime, spentOn, id, memo } = data;

  startDateTime = dateToEpochSeconds(startDateTime);
  endDateTime = dateToEpochSeconds(endDateTime);

  if (data.id) {
    return await prisma.timeBlock.update({
      where: { id },
      data: {
        startDateTime,
        endDateTime,
        spentOn,
        memo,
      },
    })
  } else {
    return await prisma.timeBlock.create({
      data: {
        startDateTime,
        endDateTime,
        spentOn,
        memo,
      },
    })
  }
}

// 2. List function
export async function listTimeBlocks(startDateRange, endDateRange) {
  let filter = {};

  if (startDateRange && endDateRange) {
    filter = {
      startDateTime: {
        gte: dateToEpochSeconds(startDateRange),
        lte: dateToEpochSeconds(endDateRange),
      },
    };
  }

  const timeBlocks = await prisma.timeBlock.findMany({
    where: filter,
  });

  return timeBlocks.map((tb) => ({
    ...tb,
    startDateTime: epochSecondsToDate(tb.startDateTime),
    endDateTime: epochSecondsToDate(tb.endDateTime),
  }));
}

// 3. Delete function
export async function deleteTimeBlock({ id }) {
  const deletedTimeBlock = await prisma.timeBlock.delete({
    where: { id },
  });

  return deletedTimeBlock;
}


export async function setTimer({ name, due, start, isActive, activity }) {
  const timer = await prisma.timer.upsert({
    where: { name },
    update: { 
      start,
      due,
      isActive,
      activity,
    },
    create: { 
      name,
      start: start || 0,
      due: due || 0,
      isActive: isActive || false
    },
  });

  return timer;
}

export async function getTimer({ name }) {
  const timer = await prisma.timer.findUnique({
    where: { name },
  });

  return timer;
}