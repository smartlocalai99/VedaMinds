import jwt from "jsonwebtoken";
import { getAgentById, updateAgent, } from "../../../services/agentService";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "PUT") {
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

    if (req.method === "GET") {
  const agent = await getAgentById(id);

  return res.status(200).json({
    success: true,
    data: agent,
  });
}

if (req.method === "PUT") {
  const agent = await updateAgent(id, req.body);

  return res.status(200).json({
    success: true,
    message: "Agent Updated Successfully",
    data: agent,
  });
}

    const agent = await getAgentById(id);

    return res.status(200).json({
      success: true,
      data: agent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}