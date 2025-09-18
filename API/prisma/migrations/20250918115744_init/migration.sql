/*
  Warnings:

  - You are about to drop the `routes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_machineId_fkey`;

-- DropIndex
DROP INDEX `Task_machineId_fkey` ON `task`;

-- AlterTable
ALTER TABLE `task` MODIFY `machineId` INTEGER NULL;

-- DropTable
DROP TABLE `routes`;

-- CreateTable
CREATE TABLE `Sets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `machineId` INTEGER NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subsets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Change` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Repair` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChangeSubsets` (
    `changeId` INTEGER NOT NULL,
    `subsetId` INTEGER NOT NULL,

    PRIMARY KEY (`changeId`, `subsetId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepairSubsets` (
    `repairId` INTEGER NOT NULL,
    `subsetId` INTEGER NOT NULL,

    PRIMARY KEY (`repairId`, `subsetId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SetToSubsets` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SetToSubsets_AB_unique`(`A`, `B`),
    INDEX `_SetToSubsets_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sets` ADD CONSTRAINT `Sets_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChangeSubsets` ADD CONSTRAINT `ChangeSubsets_changeId_fkey` FOREIGN KEY (`changeId`) REFERENCES `Change`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChangeSubsets` ADD CONSTRAINT `ChangeSubsets_subsetId_fkey` FOREIGN KEY (`subsetId`) REFERENCES `Subsets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairSubsets` ADD CONSTRAINT `RepairSubsets_repairId_fkey` FOREIGN KEY (`repairId`) REFERENCES `Repair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairSubsets` ADD CONSTRAINT `RepairSubsets_subsetId_fkey` FOREIGN KEY (`subsetId`) REFERENCES `Subsets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SetToSubsets` ADD CONSTRAINT `_SetToSubsets_A_fkey` FOREIGN KEY (`A`) REFERENCES `Sets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SetToSubsets` ADD CONSTRAINT `_SetToSubsets_B_fkey` FOREIGN KEY (`B`) REFERENCES `Subsets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
