import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const { id } = req.query;

    const {
      customerName,
      mobile,
      email,
      gender,
      discountPercentage,
      status,
      photoUrl
    } = req.body;

    const membership = await prisma.membership.update({
      where: {
        id,
      },
      data: {
        customerName,
        mobile,
        email,
        gender,
        discountPercentage: Number(discountPercentage),
        status,
        photoUrl
      },
    });

    return res.status(200).json({
      success: true,
      membership,
      message: "Membership Updated Successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}