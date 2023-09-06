/*
  Warnings:

  - You are about to drop the `Slot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "meetings" DROP CONSTRAINT "meetings_slotId_fkey";

-- DropTable
DROP TABLE "Slot";

-- CreateTable
CREATE TABLE "slots" (
    "id" TEXT NOT NULL,
    "slotDateTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "slots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
