import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../../../lib/prisma";

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

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found",
  });
}

    const match = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );

    if (!match) {

      return res.status(400).json({
        success: false,
        message: "Current Password is incorrect.",
      });

    }

    const hashedPassword = await bcrypt.hash(
      req.body.newPassword,
      10
    );

    await prisma.user.update({

      where: {
        id: user.id,
      },

      data: {

        password: hashedPassword,

        mustChangePassword: false,

      },

    });

    return res.status(200).json({

      success: true,

      message: "Password Updated Successfully",

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

}