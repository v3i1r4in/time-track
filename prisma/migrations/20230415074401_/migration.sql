/*
  Warnings:

  - You are about to drop the column `value` on the `Timer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Timer" DROP COLUMN "value",
ADD COLUMN     "due" INTEGER,
ADD COLUMN     "start" INTEGER;
