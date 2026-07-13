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

    const { mobile, otp } = req.body;

    console.log("Mobile Received:", mobile);
    console.log("OTP Received:", otp);

    const user = await prisma.user.findFirst({
  where: {
    mobile: mobile,
  },
  include: {
    role: true,
  },
});

console.log("User Found:", user);

    if (!user || user.role.name !== "VENDOR") {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        token: otp,
        used: false,
      },
    });

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    if (resetToken.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired.",
      });
    }

    await prisma.passwordResetToken.update({
      where: {
        id: resetToken.id,
      },
      data: {
        used: true,
      },
    });

    const jwtToken = jwt.sign(
      {
        userId: user.id,
        purpose: "RESET_PASSWORD",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    return res.status(200).json({
      success: true,
      resetToken: jwtToken,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

}