import prisma from "../../../lib/prisma";
import crypto from "crypto";
import { sendSMS } from "../../../services/smsService";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {

    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required.",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        mobile,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Mobile number not found.",
      });
    }

    if (user.role.name !== "VENDOR") {
      return res.status(403).json({
        success: false,
        message: "Only Vendors can reset password.",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.passwordResetToken.create({
      data: {
        token: otp,
        userId: user.id,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendSMS(
      user.mobile,
      `Your VEDA Vendor password reset OTP is ${otp}. It is valid for 10 minutes.`
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

}