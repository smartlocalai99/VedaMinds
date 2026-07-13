import prisma from "@/lib/prisma";

export async function generateMembershipNumber() {
  const lastMembership = await prisma.membership.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!lastMembership) {
    return "MEM000001";
  }

  const lastNumber = parseInt(
    lastMembership.membershipNumber.replace("MEM", ""),
    10
  );

  const nextNumber = lastNumber + 1;

  return `MEM${String(nextNumber).padStart(6, "0")}`;
}