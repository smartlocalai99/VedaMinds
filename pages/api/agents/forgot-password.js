import prisma from "../../../lib/prisma";
import crypto from "crypto";
import { sendSMS } from "../../../services/smsService";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {

    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required.",
      });
    }

    // Find Agent User
    const user = await prisma.user.findFirst({
    where: {
        mobile,
    },
    include: {
        role: true,
    },
});

    if (!user) {
      return res.status(404).json({
        success: false,
        message:"Mobile number not found."
      });
    }

    if (user.role.name !== "AGENT") {
      return res.status(403).json({
        success: false,
        message: "Only Agents can reset password.",
      });
    }

    // Generate 6 Digit OTP
    const otp = crypto.randomInt(100000,999999).toString();

    // Delete Previous OTP
    await prisma.passwordResetToken.deleteMany({
      where:{
        userId:user.id,
      },
    });

    // Save OTP
    await prisma.passwordResetToken.create({

      data:{

        token:otp,

        userId:user.id,

        expiresAt:new Date(Date.now()+10*60*1000)

      }

    });

    // Send Email
    await sendSMS(
  user.mobile,
  `Your VEDA password reset OTP is ${otp}. It is valid for 10 minutes.`
);

    return res.status(200).json({

      success:true,

      message:"OTP sent successfully."

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

}