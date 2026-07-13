import jwt from "jsonwebtoken";
import { deleteVendor } from "../../../../services/vendorService";

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

    console.log("Deleting Vendor ID:", id);

    await deleteVendor(id);
    console.log("Vendor Deleted Successfully");

    return res.status(200).json({
      success: true,
      message: "Vendor Deleted Successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

}