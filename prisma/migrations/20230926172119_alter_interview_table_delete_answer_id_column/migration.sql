/*
  Warnings:

  - You are about to drop the column `candidateId` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `answerId` on the `Interview` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_candidateId_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "candidateId";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "answerId";
