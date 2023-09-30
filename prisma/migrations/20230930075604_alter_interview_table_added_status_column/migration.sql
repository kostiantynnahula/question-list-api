-- CreateEnum
CREATE TYPE "InteviewStatus" AS ENUM ('CREATED', 'STARTED', 'COMPLETED');

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "status" "InteviewStatus" NOT NULL DEFAULT 'CREATED';
