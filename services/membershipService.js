import prisma from "@/lib/prisma";
import { generateMembershipNumber } from "@/utils/generateMembershipNumber";

export async function createMembership(data) {
  const {
    agentId,
    customerName,
    mobile,
    email,
    gender,
    photoUrl,
  } = data;

  // Required validation
  if (!agentId || !customerName || !mobile) {
    throw new Error("Agent, Customer Name and Mobile are required.");
  }

  // Check duplicate mobile
  const existingCustomer = await prisma.membership.findUnique({
    where: {
      mobile,
    },
  });

  if (existingCustomer) {
    throw new Error("Customer mobile already exists.");
  }

  // Generate Membership Number
  const membershipNumber = await generateMembershipNumber();

  // Barcode Value
  const barcodeValue = membershipNumber;

  // Dates
  const startDate = new Date();

  const expiryDate = new Date(startDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  // Save Membership
  const membership = await prisma.membership.create({
    data: {
      membershipNumber,
      agentId,
      customerName,
      mobile,
      email: email || null,
      gender: gender || null,
      photoUrl: photoUrl || null,
      barcodeValue,
      startDate,
      expiryDate,
      discountPercentage: 10,
      status: "ACTIVE",
    },
  });

  return membership;
}