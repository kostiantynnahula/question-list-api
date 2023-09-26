/*
  Warnings:

  - You are about to drop the column `testId` on the `Answer` table. All the data in the column will be lost.
  - Added the required column `interviewId` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `answerId` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_testId_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "testId",
ADD COLUMN     "interviewId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "answerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
