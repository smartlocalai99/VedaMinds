import prisma from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

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

    const { membershipNumber } = req.query;

    const membership = await prisma.membership.findFirst({
      where: {
        membershipNumber,
      },
    });

    if (!membership) {

      await prisma.membershipScanLog.create({
        data: {
          membershipId: "",
          vendorId: vendor.id,
          scanResult: "INVALID",
          remarks: "Membership Not Found",
        },
      });

      return res.status(404).json({
        success: false,
        message: "Membership Not Found",
      });

    }

    const today = new Date();

    if (new Date(membership.expiryDate) < today) {

      await prisma.membership.update({
        where: {
          id: membership.id,
        },
        data: {
          status: "EXPIRED",
        },
      });

      await prisma.membershipScanLog.create({
        data: {
          membershipId: membership.id,
          vendorId: vendor.id,
          scanResult: "EXPIRED",
          remarks: "Membership Expired",
        },
      });

      return res.status(400).json({
        success: false,
        message: "Membership Card Expired",
      });

    }

    if (membership.status === "BLOCKED") {

      await prisma.membershipScanLog.create({
        data: {
          membershipId: membership.id,
          vendorId: vendor.id,
          scanResult: "BLOCKED",
          remarks: "Membership Blocked",
        },
      });

      return res.status(400).json({
        success: false,
        message: "Membership Blocked",
      });

    }

    await prisma.membershipScanLog.create({
      data: {
        membershipId: membership.id,
        vendorId: vendor.id,
        scanResult: "SUCCESS",
        remarks: "Membership Verified Successfully",
      },
    });

    return res.status(200).json({
      success: true,
      membership,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

}