-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'BLOCKED');

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "membershipNumber" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "gender" "Gender",
    "photoUrl" TEXT,
    "barcodeValue" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "discountPercentage" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Membership_membershipNumber_key" ON "Membership"("membershipNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_mobile_key" ON "Membership"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_barcodeValue_key" ON "Membership"("barcodeValue");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
