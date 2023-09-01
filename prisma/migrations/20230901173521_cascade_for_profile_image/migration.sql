-- DropForeignKey
ALTER TABLE "personalInformation" DROP CONSTRAINT "personalInformation_imageId_fkey";

-- AddForeignKey
ALTER TABLE "personalInformation" ADD CONSTRAINT "personalInformation_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
