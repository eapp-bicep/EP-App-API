-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_ideaId_fkey";

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
