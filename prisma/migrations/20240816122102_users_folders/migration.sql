-- AlterTable
ALTER TABLE "folders" ADD COLUMN     "usersId" INTEGER;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
