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

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    // Find User
    const user = await prisma.user.findFirst({
    where: {
        mobile,
    },
});

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Find OTP
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

    // Check Expiry
    if (resetToken.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    // Generate temporary JWT for reset password
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

    await prisma.passwordResetToken.update({
  where: {
    id: resetToken.id,
  },
  data: {
    used: true,
  },
});

    return res.status(200).json({
      success: true,
      message: "OTP Verified Successfully",
      resetToken: jwtToken,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

}