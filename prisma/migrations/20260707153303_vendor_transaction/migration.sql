-- CreateEnum
CREATE TYPE "ScanResult" AS ENUM ('SUCCESS', 'EXPIRED', 'BLOCKED', 'INVALID');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'UPI', 'CARD');

-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "qrCodeUrl" TEXT;

-- CreateTable
CREATE TABLE "MembershipScanLog" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "scanDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scanResult" "ScanResult" NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "MembershipScanLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseTransaction" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "billAmount" DECIMAL(10,2) NOT NULL,
    "discountPercentage" DOUBLE PRECISION NOT NULL,
    "discountAmount" DECIMAL(10,2) NOT NULL,
    "finalAmount" DECIMAL(10,2) NOT NULL,
    "paymentMode" "PaymentMode" NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MembershipScanLog" ADD CONSTRAINT "MembershipScanLog_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipScanLog" ADD CONSTRAINT "MembershipScanLog_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseTransaction" ADD CONSTRAINT "PurchaseTransaction_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseTransaction" ADD CONSTRAINT "PurchaseTransaction_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
