import { Request } from "express";
import multer from "multer";

declare global {
  namespace Express {
    interface Request {
      file?: multer.File;
      files?: multer.File[];
      user?: {
        userId: string;
        [key: string]: any;
      };
    }
  }
}
