/*
  Warnings:

  - Added the required column `password` to the `Adimins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `adimins` ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `employees` ADD COLUMN `password` VARCHAR(191) NOT NULL;
