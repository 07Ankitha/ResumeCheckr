/*
  Warnings:

  - You are about to alter the column `score` on the `ResumeAnalysis` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "ResumeAnalysis" ALTER COLUMN "score" SET DATA TYPE INTEGER;
