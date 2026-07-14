import jwt from "jsonwebtoken";
import prisma from "../../../lib/prisma";

import { getVendorsByAgent } from "../../../services/vendorService";

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const agent = await prisma.agent.findUnique({
      where: {
        userId: decoded.id,
      },
    });

    if (!agent) {
      return res.status(403).json({
        success: false,
        message: "Only Agents can access vendors.",
      });
    }

    const vendors = await getVendorsByAgent(agent.id);

    return res.status(200).json({
      success: true,
      vendors,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

}