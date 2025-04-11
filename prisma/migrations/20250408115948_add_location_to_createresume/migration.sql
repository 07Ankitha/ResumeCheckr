/*
  Warnings:

  - You are about to drop the column `createdAt` on the `createresume` table. All the data in the column will be lost.
  - The `education` column on the `createresume` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `experience` column on the `createresume` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `certifications` to the `createresume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `github` to the `createresume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkedin` to the `createresume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `createresume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portfolio` to the `createresume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "createresume" DROP COLUMN "createdAt",
ADD COLUMN     "certifications" TEXT NOT NULL,
ADD COLUMN     "github" TEXT NOT NULL,
ADD COLUMN     "linkedin" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "portfolio" TEXT NOT NULL,
ADD COLUMN     "projects" TEXT[],
DROP COLUMN "education",
ADD COLUMN     "education" TEXT[],
DROP COLUMN "experience",
ADD COLUMN     "experience" TEXT[];
