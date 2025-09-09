/*
  Warnings:

  - You are about to drop the column `birthDate` on the `adimins` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `adimins` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `adimins` DROP COLUMN `birthDate`,
    DROP COLUMN `phone`;
