/*
  Warnings:

  - A unique constraint covering the columns `[buildingId,apartment]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "apartment" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_buildingId_apartment_key" ON "users"("buildingId", "apartment");
