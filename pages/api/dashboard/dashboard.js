import prisma from "../../../lib/prisma";

export default async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {

    const transactions = await prisma.purchaseTransaction.findMany({

      include: {
        membership: true,
        vendor: true,
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