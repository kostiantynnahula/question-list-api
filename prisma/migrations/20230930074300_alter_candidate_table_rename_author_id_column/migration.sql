/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Candidate` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_creatorId_fkey";

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "creatorId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
