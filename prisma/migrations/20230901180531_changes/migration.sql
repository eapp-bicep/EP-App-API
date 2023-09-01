/*
  Warnings:

  - Made the column `imageId` on table `personalInformation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "personalInformation" ALTER COLUMN "imageId" SET NOT NULL;
