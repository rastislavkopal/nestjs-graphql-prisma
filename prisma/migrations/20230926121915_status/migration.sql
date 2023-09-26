/*
  Warnings:

  - You are about to drop the column `isApproved` on the `Booking` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('OPEN', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "isApproved",
ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'OPEN';
