-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'MENTOR', 'ENTREPRENEUR', 'INVESTOR');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PROFILE_PICTURE', 'IDEA_PITCH_DECK', 'MENTOR_PROFILE_PICTURE');

-- CreateTable
CREATE TABLE "occupations" (
    "id" TEXT NOT NULL,
    "occupation_name" TEXT NOT NULL,

    CONSTRAINT "occupations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "segments" (
    "id" TEXT NOT NULL,
    "segment_name" TEXT NOT NULL,

    CONSTRAINT "segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdeaStage" (
    "id" TEXT NOT NULL,
    "stage" TEXT NOT NULL,

    CONSTRAINT "IdeaStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "role" "Roles" NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "pinCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingStepOnRole" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "stepName" TEXT NOT NULL,

    CONSTRAINT "OnboardingStepOnRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "imgFullPath" TEXT NOT NULL,
    "imgName" TEXT NOT NULL,
    "imgOriginalName" TEXT NOT NULL,
    "imgDownloadUrl" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "imgType" "DocumentType" NOT NULL,
    "ideaId" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "roleId" TEXT NOT NULL,
    "onboardingStepId" TEXT NOT NULL,
    "fcmToken" TEXT,
    "refreshTokenHash" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personalInformation" (
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "occupationId" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personalInformation_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "businessInformation" (
    "userId" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "officeAddress" TEXT NOT NULL,
    "officeContact" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "segmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "businessInformation_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "ideas" (
    "id" TEXT NOT NULL,
    "problemStatement" TEXT NOT NULL,
    "ideaStageId" TEXT NOT NULL,
    "segmentId" TEXT NOT NULL,
    "proposedSolution" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOnIdeas" (
    "userId" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,

    CONSTRAINT "UserOnIdeas_pkey" PRIMARY KEY ("userId","ideaId")
);

-- CreateIndex
CREATE UNIQUE INDEX "occupations_occupation_name_key" ON "occupations"("occupation_name");

-- CreateIndex
CREATE UNIQUE INDEX "segments_segment_name_key" ON "segments"("segment_name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_key" ON "roles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_email_idx" ON "users"("username", "email");

-- AddForeignKey
ALTER TABLE "OnboardingStepOnRole" ADD CONSTRAINT "OnboardingStepOnRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_onboardingStepId_fkey" FOREIGN KEY ("onboardingStepId") REFERENCES "OnboardingStepOnRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personalInformation" ADD CONSTRAINT "personalInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personalInformation" ADD CONSTRAINT "personalInformation_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personalInformation" ADD CONSTRAINT "personalInformation_occupationId_fkey" FOREIGN KEY ("occupationId") REFERENCES "occupations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personalInformation" ADD CONSTRAINT "personalInformation_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businessInformation" ADD CONSTRAINT "businessInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businessInformation" ADD CONSTRAINT "businessInformation_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "segments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_ideaStageId_fkey" FOREIGN KEY ("ideaStageId") REFERENCES "IdeaStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "segments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnIdeas" ADD CONSTRAINT "UserOnIdeas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnIdeas" ADD CONSTRAINT "UserOnIdeas_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
