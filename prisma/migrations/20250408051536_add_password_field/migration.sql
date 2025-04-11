/*
  Warnings:

  - You are about to drop the column `education` on the `LinkedInProfile` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `LinkedInProfile` table. All the data in the column will be lost.
  - You are about to drop the column `headline` on the `LinkedInProfile` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `LinkedInProfile` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `LinkedInProfile` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `certifications` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `missingKeywords` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `overallScore` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `personalInfo` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `projects` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `strengths` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `suggestions` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `weaknesses` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Made the column `fileUrl` on table `Resume` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `feedback` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ResumeAnalysis_resumeId_idx";

-- DropIndex
DROP INDEX "ResumeAnalysis_userId_idx";

-- AlterTable
ALTER TABLE "LinkedInProfile" DROP COLUMN "education",
DROP COLUMN "experience",
DROP COLUMN "headline",
DROP COLUMN "skills",
DROP COLUMN "summary",
ADD COLUMN     "lastSynced" TIMESTAMP(3),
ADD COLUMN     "profileData" JSONB;

-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "content",
ALTER COLUMN "fileUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "ResumeAnalysis" DROP COLUMN "certifications",
DROP COLUMN "education",
DROP COLUMN "experience",
DROP COLUMN "missingKeywords",
DROP COLUMN "overallScore",
DROP COLUMN "personalInfo",
DROP COLUMN "projects",
DROP COLUMN "skills",
DROP COLUMN "strengths",
DROP COLUMN "suggestions",
DROP COLUMN "summary",
DROP COLUMN "updatedAt",
DROP COLUMN "weaknesses",
ADD COLUMN     "feedback" JSONB NOT NULL,
ADD COLUMN     "matchedSkills" TEXT[],
ADD COLUMN     "missingSkills" TEXT[],
ADD COLUMN     "score" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "password",
DROP COLUMN "role",
DROP COLUMN "updatedAt";
