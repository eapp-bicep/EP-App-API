-- CreateEnum
CREATE TYPE "MeetingRequestStatus" AS ENUM ('ACCEPTED', 'PENDING', 'REJECTED');

-- CreateTable
CREATE TABLE "Slot" (
    "id" TEXT NOT NULL,
    "slotDateTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meetings" (
    "id" TEXT NOT NULL,
    "scheduledByUserId" TEXT,
    "scheduledWithUserId" TEXT,
    "slotId" TEXT NOT NULL,
    "requestStatus" "MeetingRequestStatus" NOT NULL DEFAULT 'PENDING',
    "meetingLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "meetings_scheduledByUserId_scheduledWithUserId_slotId_key" ON "meetings"("scheduledByUserId", "scheduledWithUserId", "slotId");

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_scheduledByUserId_fkey" FOREIGN KEY ("scheduledByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_scheduledWithUserId_fkey" FOREIGN KEY ("scheduledWithUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
