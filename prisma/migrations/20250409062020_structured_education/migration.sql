/*
  Warnings:

  - The `projects` column on the `createresume` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `education` column on the `createresume` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `experience` column on the `createresume` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "createresume" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "projects",
ADD COLUMN     "projects" JSONB,
DROP COLUMN "education",
ADD COLUMN     "education" JSONB,
DROP COLUMN "experience",
ADD COLUMN     "experience" JSONB;
