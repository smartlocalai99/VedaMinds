import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {

  if (req.method !== "POST") {
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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const vendor = await prisma.vendor.findUnique({
      where: {
        userId: decoded.id,
      },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor Not Found",
      });
    }

    const {
      membershipId,
      billAmount,
      discountPercentage,
      discountAmount,
      finalAmount,
      paymentMode,
    } = req.body;

    const purchase = await prisma.purchaseTransaction.create({

      data: {

        membershipId,

        vendorId: vendor.id,

        billAmount,

        discountPercentage,

        discountAmount,

        finalAmount,

        paymentMode,

      },

    });

    const membership = await prisma.membership.findUnique({
  where: {
    id: membershipId,
  },
});

await prisma.notificationLog.create({
  data: {
    type: "SMS",
    userId: null,
    recipient: membership.mobile,
    subject: "Purchase Completed",
    message:
      `Dear ${membership.customerName}, your purchase of ₹${billAmount} is successful. You saved ₹${discountAmount}. Final Amount: ₹${finalAmount}. Thank you for shopping with VEDA.`,
    status: "SENT",
    provider: "SYSTEM",
    sentAt: new Date(),
  },
});

    return res.status(200).json({

      success: true,

      purchase,

      message: "Purchase Completed Successfully",

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

}