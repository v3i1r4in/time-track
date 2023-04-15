-- CreateTable
CREATE TABLE "TimeBlock" (
    "startDateTime" INTEGER NOT NULL,
    "endDateTime" INTEGER NOT NULL,
    "spentOn" TEXT NOT NULL,

    CONSTRAINT "TimeBlock_pkey" PRIMARY KEY ("startDateTime")
);
