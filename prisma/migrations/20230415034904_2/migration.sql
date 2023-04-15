/*
  Warnings:

  - The primary key for the `TimeBlock` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "TimeBlock" DROP CONSTRAINT "TimeBlock_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "TimeBlock_pkey" PRIMARY KEY ("id");
