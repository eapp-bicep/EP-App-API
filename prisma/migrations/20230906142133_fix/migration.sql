/*
  Warnings:

  - You are about to drop the column `slotDateTime` on the `slots` table. All the data in the column will be lost.
  - Added the required column `slotTime` to the `slots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "slots" DROP COLUMN "slotDateTime",
ADD COLUMN     "slotTime" TIME NOT NULL;
