import prisma from "../../../lib/prisma";

export default async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {

    const { agentId } = req.query;

    const memberships = await prisma.membership.findMany({

      where: {
        agentId,
      },

      orderBy: {
        createdAt: "desc",
      },

    });

    return res.status(200).json({

      success: true,

      memberships,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Internal Server Error",

    });

  }

}