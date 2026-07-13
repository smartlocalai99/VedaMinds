import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const { membershipNumber } = req.query;

    const membership = await prisma.membership.findUnique({
      where: {
        membershipNumber,
      },
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found.",
      });
    }

    if (membership.status === "EXPIRED") {
      return res.status(400).json({
        success: false,
        message: "Membership has expired.",
      });
    }

    if (membership.status === "BLOCKED") {
      return res.status(400).json({
        success: false,
        message: "Membership is blocked.",
      });
    }

    return res.status(200).json({
      success: true,
      membership,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}