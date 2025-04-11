/*
  Warnings:

  - The primary key for the `Template` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `downloadUrl` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Template` table. All the data in the column will be lost.
  - The `id` column on the `Template` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `TemplateCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Made the column `previewUrl` on table `Template` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Template" DROP CONSTRAINT "Template_categoryId_fkey";

-- Create a temporary table to store existing data
CREATE TABLE "Template_temp" AS SELECT * FROM "Template";

-- Drop the existing table
DROP TABLE "Template";

-- Create the new Template table with the updated schema
CREATE TABLE "Template" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Professional',
    "description" TEXT,
    "image" TEXT NOT NULL DEFAULT '/images/templates/default.jpg',
    "previewUrl" TEXT NOT NULL DEFAULT '/images/templates/default.jpg',
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "features" TEXT[],
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- Insert the existing data into the new table
INSERT INTO "Template" ("id", "name", "description", "previewUrl", "isPremium", "createdAt", "updatedAt")
SELECT CAST("id" AS INTEGER), "name", "description", "previewUrl", "isPremium", "createdAt", "updatedAt"
FROM "Template_temp";

-- Drop the temporary table
DROP TABLE "Template_temp";

-- Create the TemplateDownload table
CREATE TABLE "TemplateDownload" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemplateDownload_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TemplateDownload" ADD CONSTRAINT "TemplateDownload_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
