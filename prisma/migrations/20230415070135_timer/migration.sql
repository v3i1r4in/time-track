-- CreateTable
CREATE TABLE "Timer" (
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "Timer_pkey" PRIMARY KEY ("name")
);
