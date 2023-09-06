-- DropForeignKey
ALTER TABLE "meetings" DROP CONSTRAINT "meetings_slotId_fkey";

-- AlterTable
ALTER TABLE "meetings" ALTER COLUMN "slotId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;
