-- AlterTable
ALTER TABLE "files" ADD COLUMN     "foldersId" INTEGER;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_foldersId_fkey" FOREIGN KEY ("foldersId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
