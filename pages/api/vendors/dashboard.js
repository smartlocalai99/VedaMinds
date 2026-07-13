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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const vendor = await prisma.vendor.findUnique({
      where: {
        userId: decoded.id,
      },
      include: {
        user: true,
      },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    
    const transactions = await prisma.purchaseTransaction.findMany({
  where: {
    vendorId: vendor.id,
  },
});

const totalSales = transactions.reduce(
  (sum, item) => sum + Number(item.finalAmount),
  0
);

const totalDiscount = transactions.reduce(
  (sum, item) => sum + Number(item.discountAmount),
  0
);

const totalCustomers = new Set(
  transactions.map(item => item.membershipId)
).size;

    return res.status(200).json({
  success: true,
  vendor,

  dashboard: {
    totalTransactions: transactions.length,
    totalSales,
    totalDiscount,
    totalCustomers,
  },

});

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

}