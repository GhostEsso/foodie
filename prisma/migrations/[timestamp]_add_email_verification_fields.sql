-- AlterTable
ALTER TABLE "users" 
ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "verificationCode" TEXT,
ADD COLUMN "verificationCodeExpires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "users_verificationCode_key" ON "users"("verificationCode"); 