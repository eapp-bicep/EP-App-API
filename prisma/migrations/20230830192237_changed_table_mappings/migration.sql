/*
  Warnings:

  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IdeaStage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OnboardingStepOnRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserOnIdeas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_ideaId_fkey";

-- DropForeignKey
ALTER TABLE "OnboardingStepOnRole" DROP CONSTRAINT "OnboardingStepOnRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserOnIdeas" DROP CONSTRAINT "UserOnIdeas_ideaId_fkey";

-- DropForeignKey
ALTER TABLE "UserOnIdeas" DROP CONSTRAINT "UserOnIdeas_userId_fkey";

-- DropForeignKey
ALTER TABLE "ideas" DROP CONSTRAINT "ideas_ideaStageId_fkey";

-- DropForeignKey
ALTER TABLE "personalInformation" DROP CONSTRAINT "personalInformation_addressId_fkey";

-- DropForeignKey
ALTER TABLE "personalInformation" DROP CONSTRAINT "personalInformation_imageId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_onboardingStepId_fkey";

-- DropTable
DROP TABLE "Address";

-- DropTable
DROP TABLE "Document";

-- DropTable
DROP TABLE "IdeaStage";

-- DropTable
DROP TABLE "OnboardingStepOnRole";

-- DropTable
DROP TABLE "UserOnIdeas";

-- CreateTable
CREATE TABLE "ideaStages" (
    "id" TEXT NOT NULL,
    "stage" TEXT NOT NULL,

    CONSTRAINT "ideaStages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "pinCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboardingStepOnRole" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "stepName" TEXT NOT NULL,

    CONSTRAINT "onboardingStepOnRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "imgFullPath" TEXT NOT NULL,
    "imgName" TEXT NOT NULL,
    "imgOriginalName" TEXT NOT NULL,
    "imgDownloadUrl" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "imgType" "DocumentType" NOT NULL,
    "ideaId" TEXT,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userOnIdeas" (
    "userId" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,

    CONSTRAINT "userOnIdeas_pkey" PRIMARY KEY ("userId","ideaId")
);

-- AddForeignKey
ALTER TABLE "onboardingStepOnRole" ADD CONSTRAINT "onboardingStepOnRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_onboardingStepId_fkey" FOREIGN KEY ("onboardingStepId") REFERENCES "onboardingStepOnRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personalInformation" ADD CONSTRAINT "personalInformation_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personalInformation" ADD CONSTRAINT "personalInformation_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_ideaStageId_fkey" FOREIGN KEY ("ideaStageId") REFERENCES "ideaStages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userOnIdeas" ADD CONSTRAINT "userOnIdeas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userOnIdeas" ADD CONSTRAINT "userOnIdeas_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
