import jwt from "jsonwebtoken";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET);

    const { id } = req.query;

    const vendor = await prisma.vendor.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        agent: true,
      },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      vendor,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

}