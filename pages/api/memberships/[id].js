import prisma from "../../../lib/prisma";

export default async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {

    const { id } = req.query;

    const membership = await prisma.membership.findUnique({
      where: {
        id,
      },
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found",
      });
    }

    return res.status(200).json({
      success: true,
      membership,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

}