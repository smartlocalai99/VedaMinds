import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
    });
  }

  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({
        success: false,
      });
    }

    try {
      const file = Array.isArray(files.photo)
  ? files.photo[0]
  : files.photo;

const result = await cloudinary.uploader.upload(
  file.filepath,
  {
    folder: "veda-memberships",
  }
);

fs.unlinkSync(file.filepath);

      res.json({
        success: true,
        photoUrl: result.secure_url,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
  success: false,
  message: error.message,
});
    }
  });
}