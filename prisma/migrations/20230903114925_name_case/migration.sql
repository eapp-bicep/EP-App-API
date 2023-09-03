/*
  Warnings:

  - You are about to drop the column `occupation_name` on the `occupations` table. All the data in the column will be lost.
  - You are about to drop the column `segment_name` on the `segments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[occupationName]` on the table `occupations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[segmentName]` on the table `segments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `occupationName` to the `occupations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `segmentName` to the `segments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "occupations_occupation_name_key";

-- DropIndex
DROP INDEX "segments_segment_name_key";

-- AlterTable
ALTER TABLE "occupations" RENAME COLUMN "occupation_name" TO "occupationName";

-- AlterTable
ALTER TABLE "segments" RENAME COLUMN "segment_name" TO "segmentName";

-- CreateIndex
CREATE UNIQUE INDEX "occupations_occupationName_key" ON "occupations"("occupationName");

-- CreateIndex
CREATE UNIQUE INDEX "segments_segmentName_key" ON "segments"("segmentName");
