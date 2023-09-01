-- DropForeignKey
ALTER TABLE "personalInformation" DROP CONSTRAINT "personalInformation_addressId_fkey";

-- AlterTable
ALTER TABLE "personalInformation" ALTER COLUMN "imageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "personalInformation" ADD CONSTRAINT "personalInformation_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
