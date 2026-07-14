import jwt from "jsonwebtoken";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

import { createVendor } from "../../../services/vendorService";
import { generateVendorCode } from "../../../utils/generateVendorCode";
import { generatePassword } from "../../../utils/generatePassword";
import { sendVendorWelcomeEmail } from "../../../services/emailService";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {

    // Verify Token
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get Logged-in Agent
    const agent = await prisma.agent.findUnique({
      where: {
        userId: decoded.id,
      },
    });

    if (!agent) {
      return res.status(403).json({
        success: false,
        message: "Only Agents can create vendors.",
      });
    }

    // Read Form Data
    const {
      ownerName,
      shopName,
      email,
      mobile,
      businessType,
      gstNumber,
      address,
      city,
      state,
      pincode,
    } = req.body;

    // Check if email already exists
const existingEmail = await prisma.user.findUnique({
  where: {
    email,
  },
});

if (existingEmail) {
  return res.status(400).json({
    success: false,
    message: "Email already exists.",
  });
}

// Check if mobile already exists
if (mobile) {
  const existingMobile = await prisma.user.findUnique({
    where: {
      mobile,
    },
  });

  if (existingMobile) {
    return res.status(400).json({
      success: false,
      message: "Mobile number already exists.",
    });
  }
}

    // Generate Vendor Code
    const vendorCode = await generateVendorCode();

    // Generate Password
    const password = generatePassword();

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Vendor
    const vendor = await createVendor(
  {
    firstName: ownerName,
    lastName: "",
    email,
    mobile,
    password: hashedPassword,
  },
  {
    vendorCode,
    agentId: agent.id,
    ownerName,
    shopName,
    businessType,
    gstNumber,
    address,
    city,
    state,
    pincode,
  },
  password
);

try {

  await sendVendorWelcomeEmail(
  vendor.user.email,
  vendor.user.firstName,
  password
);

  console.log("Vendor Welcome Email Sent");

} catch (error) {

  console.log("Email Failed:", error.message);

}

    return res.status(201).json({
      success: true,
      message: "Vendor Created Successfully",
      vendor,
      login: {
        email,
        password,
      },
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

}