-- AlterTable
ALTER TABLE "users" ADD COLUMN "apartment" TEXT,
                    ADD COLUMN "buildingId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddUniqueConstraint
ALTER TABLE "users" ADD CONSTRAINT "users_buildingId_apartment_key" UNIQUE ("buildingId", "apartment"); 