import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import { sendAgentWelcomeEmail } from "./emailService";

import { generateAgentCode } from "../utils/generateAgentCode";
import { generatePassword } from "../utils/generatePassword";

export async function createAgent(data, createdBy) {

    const role = await prisma.role.findUnique({

        where: {
            name: "AGENT",
        },

    });

    if (!role) {
        throw new Error("Agent role not found");
    }

    const existingEmail = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });

    if (existingEmail) {
        throw new Error("Email already exists");
    }

    const existingMobile = await prisma.user.findFirst({
        where: {
            mobile: data.mobile,
        },
    });

    if (existingMobile) {
        throw new Error("Mobile already exists");
    }

    const agentCode = await generateAgentCode();

    const tempPassword = generatePassword();

    const hashedPassword = await bcrypt.hash(
        tempPassword,
        10
    );

    const result = await prisma.$transaction(async (tx) => {

        const user = await tx.user.create({

            data: {

                userCode: agentCode,

                firstName: data.firstName,

                lastName: data.lastName,

                email: data.email,

                mobile: data.mobile,

                password: hashedPassword,

                roleId: role.id,

                status: "ACTIVE",

                emailVerified: false,

                mustChangePassword: true,

            },

        });

        const agent = await tx.agent.create({

            data: {

                agentCode,

                userId: user.id,

                alternateMobile: data.alternateMobile,

                address: data.address,

                city: data.city,

                state: data.state,

                pincode: data.pincode,

                createdBy,

            },

        });

        return {
            user,
            agent,
            tempPassword,
        };

    });

    try {
  await sendAgentWelcomeEmail(
    result.user.email,
    result.user.firstName,
    result.tempPassword
  );
} catch (error) {
  console.log("Email Failed:", error.message);
}

return result;

}

export async function getAllAgents() {
  const agents = await prisma.agent.findMany({
    where: {
      isDeleted: false,
    },

    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          mobile: true,
          status: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return agents;
}

export async function getAgentById(id) {
  const agent = await prisma.agent.findUnique({
    where: {
      id,
    },

    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          mobile: true,
          status: true,
        },
      },
    },
  });

  if (!agent || agent.isDeleted) {
    throw new Error("Agent not found");
  }

  return agent;
}

export async function updateAgent(id, data) {
  const existingAgent = await prisma.agent.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  if (!existingAgent || existingAgent.isDeleted) {
    throw new Error("Agent not found");
  }

  const emailExists = await prisma.user.findFirst({
    where: {
      email: data.email,
      id: {
        not: existingAgent.user.id,
      },
    },
  });

  if (emailExists) {
    throw new Error("Email already exists");
  }

  const mobileExists = await prisma.user.findFirst({
    where: {
      mobile: data.mobile,
      id: {
        not: existingAgent.user.id,
      },
    },
  });

  if (mobileExists) {
    throw new Error("Mobile already exists");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: existingAgent.user.id,
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile,
        status: data.status,
      },
    });

    const agent = await tx.agent.update({
      where: {
        id,
      },
      data: {
        alternateMobile: data.alternateMobile,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      },
      include: {
        user: true,
      },
    });

    return agent;
  });

  return result;
}

export async function deleteAgent(id) {
  console.log("Deleting Agent ID:", id);

  const agent = await prisma.agent.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  console.log("Agent Found:", agent);

  if (!agent) {
    throw new Error("Agent not found");
  }

  await prisma.user.delete({
    where: {
      id: agent.user.id,
    },
  });

  return true;
}