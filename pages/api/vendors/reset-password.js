import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {

  if (req.method !== "PUT") {
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

    if (decoded.purpose !== "RESET_PASSWORD") {
      return res.status(401).json({
        success: false,
        message: "Invalid Reset Token",
      });
    }

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: decoded.userId,
      },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
        loginAttempts: 0,
        accountLockedUntil: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

}