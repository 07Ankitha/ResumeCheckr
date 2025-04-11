/*
  Warnings:

  - Made the column `projects` on table `createresume` required. This step will fail if there are existing NULL values in that column.
  - Made the column `education` on table `createresume` required. This step will fail if there are existing NULL values in that column.
  - Made the column `experience` on table `createresume` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "createresume" ALTER COLUMN "projects" SET NOT NULL,
ALTER COLUMN "education" SET NOT NULL,
ALTER COLUMN "experience" SET NOT NULL;
