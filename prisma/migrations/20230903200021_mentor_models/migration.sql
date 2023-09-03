-- AlterEnum
ALTER TYPE "DocumentType" ADD VALUE 'MENTOR_RESUME';

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "durationInMonths" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "pricePerMonth" INTEGER NOT NULL,
    "discount" INTEGER,
    "pricePerYear" INTEGER NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "txnId" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "refundStatus" TEXT,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "txnCreatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalInformation" (
    "userId" TEXT NOT NULL,
    "linkedIn" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "segmentId" TEXT NOT NULL,
    "priorMentorExperience" BOOLEAN NOT NULL DEFAULT false,
    "currentJobTitle" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "timeInvestment" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalInformation_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_fieldsOfInterest" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_planId_key" ON "subscriptions"("userId", "planId");

-- CreateIndex
CREATE UNIQUE INDEX "_fieldsOfInterest_AB_unique" ON "_fieldsOfInterest"("A", "B");

-- CreateIndex
CREATE INDEX "_fieldsOfInterest_B_index" ON "_fieldsOfInterest"("B");

-- AddForeignKey
ALTER TABLE "plans" ADD CONSTRAINT "plans_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalInformation" ADD CONSTRAINT "ProfessionalInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalInformation" ADD CONSTRAINT "ProfessionalInformation_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalInformation" ADD CONSTRAINT "ProfessionalInformation_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "segments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fieldsOfInterest" ADD CONSTRAINT "_fieldsOfInterest_A_fkey" FOREIGN KEY ("A") REFERENCES "ProfessionalInformation"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fieldsOfInterest" ADD CONSTRAINT "_fieldsOfInterest_B_fkey" FOREIGN KEY ("B") REFERENCES "segments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
