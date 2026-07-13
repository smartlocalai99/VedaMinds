import prisma from "../../../lib/prisma";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {

    const {
      membershipId,
      vendorId,
      scanResult,
      remarks,
    } = req.body;

    const scan = await prisma.membershipScanLog.create({
      data: {
        membershipId,
        vendorId,
        scanResult,
        remarks,
      },
    });

    return res.status(200).json({
      success: true,
      scan,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

}