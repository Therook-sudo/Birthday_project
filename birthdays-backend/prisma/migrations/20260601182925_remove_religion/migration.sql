/*
  Warnings:

  - You are about to drop the column `religion` on the `Birthday` table. All the data in the column will be lost.
  - You are about to drop the column `religion` on the `BirthdayRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Birthday" DROP COLUMN "religion";

-- AlterTable
ALTER TABLE "BirthdayRequest" DROP COLUMN "religion";

-- DropEnum
DROP TYPE "Religion";
