-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "testId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;
