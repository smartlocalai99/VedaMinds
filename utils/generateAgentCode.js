import prisma from "../lib/prisma";

export async function generateAgentCode() {

    const lastAgent = await prisma.agent.findFirst({

        orderBy: {
            createdAt: "desc",
        },

    });

    if (!lastAgent) {
        return "AGT0001";
    }

    const lastNumber = parseInt(
        lastAgent.agentCode.replace("AGT", "")
    );

    const nextNumber = lastNumber + 1;

    return "AGT" + String(nextNumber).padStart(4, "0");
}