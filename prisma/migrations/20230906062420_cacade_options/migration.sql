-- DropForeignKey
ALTER TABLE "businessInformation" DROP CONSTRAINT "businessInformation_userId_fkey";

-- DropForeignKey
ALTER TABLE "personalInformation" DROP CONSTRAINT "personalInformation_addressId_fkey";

-- DropForeignKey
ALTER TABLE "personalInformation" DROP CONSTRAINT "personalInformation_imageId_fkey";

-- DropForeignKey
ALTER TABLE "personalInformation" DROP CONSTRAINT "personalInformation_userId_fkey";

-- DropForeignKey
ALTER TABLE "userOnIdeas" DROP CONSTRAINT "userOnIdeas_ideaId_fkey";

-- DropForeignKey
ALTER TABLE "userOnIdeas" DROP CONSTRAINT "userOnIdeas_userId_fkey";

-- AddForeignKey
ALTER TABLE "personalInformation" ADD CONSTRAINT "personalInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personalInformation" ADD CONSTRAINT "personalInformation_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personalInformation" ADD CONSTRAINT "personalInformation_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businessInformation" ADD CONSTRAINT "businessInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userOnIdeas" ADD CONSTRAINT "userOnIdeas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userOnIdeas" ADD CONSTRAINT "userOnIdeas_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
