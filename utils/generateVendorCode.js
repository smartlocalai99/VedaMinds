import prisma from "../lib/prisma";

export async function generateVendorCode() {

  const count = await prisma.vendor.count();

  const nextNumber = count + 1;

  return `VEN${String(nextNumber).padStart(5, "0")}`;

}