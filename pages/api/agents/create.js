import jwt from "jsonwebtoken";

import { createAgent } from "../../../services/agentService";

export default async function handler(req, res) {

    if (req.method !== "POST") {

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

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role !== "SUPER_ADMIN") {

            return res.status(403).json({

                success: false,

                message: "Access Denied",

            });

        }

        const result = await createAgent(
            req.body,
            decoded.id
        );

        return res.status(201).json({

            success: true,

            message: "Agent Created Successfully",

            data: result,

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

}