import prisma from "../../../lib/prisma";

export default async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {

    const transactions = await prisma.purchaseTransaction.findMany();

    const totalTransactions = transactions.length;

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
      report: {
        totalTransactions,
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