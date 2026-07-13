import prisma from "../lib/prisma";

export async function getDashboardCounts() {
  const agents = await prisma.agent.count({
    where: {
      isDeleted: false,
    },
  });

  const vendors = 0;
  const memberships = 0;

  return {
    agents,
    vendors,
    memberships,
  };
}