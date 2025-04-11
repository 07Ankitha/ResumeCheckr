/*
  Warnings:

  - You are about to drop the column `matchedSkills` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `missingSkills` on the `ResumeAnalysis` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resumeId]` on the table `ResumeAnalysis` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `certifications` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `education` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grammarErrors` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grammarScore` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `missingFields` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personalInfo` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projects` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectionScores` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skills` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wordCount` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wordCountScore` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ResumeAnalysis" DROP COLUMN "matchedSkills",
DROP COLUMN "missingSkills",
ADD COLUMN     "certifications" JSONB NOT NULL,
ADD COLUMN     "education" JSONB NOT NULL,
ADD COLUMN     "experience" JSONB NOT NULL,
ADD COLUMN     "grammarErrors" INTEGER NOT NULL,
ADD COLUMN     "grammarScore" INTEGER NOT NULL,
ADD COLUMN     "missingFields" INTEGER NOT NULL,
ADD COLUMN     "personalInfo" JSONB NOT NULL,
ADD COLUMN     "projects" JSONB NOT NULL,
ADD COLUMN     "sectionScores" JSONB NOT NULL,
ADD COLUMN     "skills" JSONB NOT NULL,
ADD COLUMN     "strengths" TEXT[],
ADD COLUMN     "suggestions" TEXT[],
ADD COLUMN     "summary" TEXT NOT NULL,
ADD COLUMN     "weaknesses" TEXT[],
ADD COLUMN     "wordCount" INTEGER NOT NULL,
ADD COLUMN     "wordCountScore" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ResumeAnalysisWithJob" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "overallScore" INTEGER,
    "techMatch" JSONB NOT NULL,
    "matchedSkills" TEXT[],
    "missingSkills" TEXT[],
    "extraSkills" TEXT[],
    "breakdown" JSONB NOT NULL,

    CONSTRAINT "ResumeAnalysisWithJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResumeAnalysisWithJob_resumeId_key" ON "ResumeAnalysisWithJob"("resumeId");

-- CreateIndex
CREATE UNIQUE INDEX "ResumeAnalysis_resumeId_key" ON "ResumeAnalysis"("resumeId");

-- AddForeignKey
ALTER TABLE "ResumeAnalysisWithJob" ADD CONSTRAINT "ResumeAnalysisWithJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeAnalysisWithJob" ADD CONSTRAINT "ResumeAnalysisWithJob_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
