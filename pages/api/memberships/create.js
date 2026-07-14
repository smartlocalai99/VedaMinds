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
      agentId,
      customerName,
      mobile,
      email,
      gender,
       photoUrl,
      discountPercentage,
      startDate,
      expiryDate,
    } = req.body;

    // Check duplicate mobile
    const existing = await prisma.membership.findFirst({
      where: {
        mobile,
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Mobile already registered.",
      });
    }

    // Generate Membership Number
    const total = await prisma.membership.count();

    const membershipNumber =
      "VEDA" + String(total + 1).padStart(6, "0");

    // Generate Barcode
    const barcodeValue =
      "BAR" + Date.now();

    const membership = await prisma.membership.create({

      data: {

        membershipNumber,

        agentId,

        customerName,

        mobile,

        email,

        gender,

        photoUrl,

        barcodeValue,

        startDate: new Date(startDate),

        expiryDate: new Date(expiryDate),

        discountPercentage: Number(discountPercentage),

      },

    });

    return res.status(201).json({

      success: true,

      message: "Membership Created Successfully",

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