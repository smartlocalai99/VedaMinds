import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      include: {
        vendor: true,
      },
    });

    const transactions = await prisma.purchaseTransaction.findMany({

      where: {
        vendorId: user.vendor.id,
      },

      include: {
        membership: true,
      },

      orderBy: {
        transactionDate: "desc",
      },

    });

    return res.status(200).json({
      success: true,
      transactions,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

}