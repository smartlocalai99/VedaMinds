import jwt from "jsonwebtoken";
import prisma from "../../../../lib/prisma";
import { updateVendor } from "../../../../services/vendorService";

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

    const agent = await prisma.agent.findUnique({
      where: {
        userId: decoded.id,
      },
    });

    if (!agent) {
      return res.status(403).json({
        success: false,
        message: "Only Agents can update vendors.",
      });
    }

    const { id } = req.query;

    const vendor = await prisma.vendor.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }

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

    const updatedVendor = await updateVendor(

      vendor.user.id,

      vendor.id,

      {
        firstName: ownerName,
        email,
        mobile,
      },

      {
        ownerName,
        shopName,
        businessType,
        gstNumber,
        address,
        city,
        state,
        pincode,
      }

    );

    return res.status(200).json({
      success: true,
      message: "Vendor Updated Successfully",
      vendor: updatedVendor,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

}