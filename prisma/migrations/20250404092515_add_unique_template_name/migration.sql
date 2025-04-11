/*
  Warnings:

  - You are about to drop the column `downloads` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the `TemplateCategory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Template` will be added. If there are existing duplicate values, this will fail.
  - Made the column `description` on table `Template` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Template" DROP COLUMN "downloads",
ALTER COLUMN "category" DROP DEFAULT,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "image" DROP DEFAULT,
ALTER COLUMN "previewUrl" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "TemplateCategory";

-- CreateIndex
CREATE UNIQUE INDEX "Template_name_key" ON "Template"("name");
