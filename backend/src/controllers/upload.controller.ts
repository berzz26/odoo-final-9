// The controller handles the HTTP request and delegates to the service.
import type { Request, Response } from "express";
import { uploadProfilePhoto } from "../services/upload.service.js";
import prisma from "../config/db.js";

export const handleFileUpload = async (req: Request, res: Response) => {
  // Assume a user ID is available from a previous middleware (e.g., authentication)
  const userId = req.user?.userId;

  if (!req.file || !userId) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const fileUrl = await uploadProfilePhoto(req.file, userId);

    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: fileUrl
      }
    })
    res.status(200).json({
      message: "File uploaded successfully",
      url: fileUrl,
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during file upload." });
  }
};
