import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and Password are required.",
    });
  }

  // Find User
  const user = await prisma.user.findUnique({
  where: {
    email,
  },
  include: {
    role: true,
    agent: true,
  },
});

console.log(user);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  // Soft Delete Check
  if (user.isDeleted) {
    return res.status(403).json({
      success: false,
      message: "Account not found.",
    });
  }

  // Status Check
  if (user.status !== "ACTIVE") {
    return res.status(403).json({
      success: false,
      message: "Your account is inactive or blocked.",
    });
  }

  // Password Check
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  // Only AGENT can login here
if (user.role.name !== "AGENT") {
  return res.status(403).json({
    success: false,
    message: "Only Agents can login.",
  });
}

  // Update Login Information
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLoginAt: new Date(),
      loginAttempts: 0,
    },
  });

  // JWT Token
  const token = jwt.sign(
    {
      id: user.id,
      userCode: user.userCode,
      email: user.email,
      role: user.role.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  return res.status(200).json({
    success: true,
    token,
    user: {
  id: user.id,
  agentId: user.agent?.id,
  userCode: user.userCode,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role.name,
  mustChangePassword: user.mustChangePassword,
},
  });
}