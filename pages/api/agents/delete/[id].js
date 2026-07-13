import jwt from "jsonwebtoken";
import { deleteAgent } from "../../../../services/agentService";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
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

    jwt.verify(token, process.env.JWT_SECRET);

    const { id } = req.query;

    await deleteAgent(id);

    return res.status(200).json({
      success: true,
      message: "Agent Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}