// src/middleware/upload.ts
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";

// Set up storage engine
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "uploads/"); // specify the destination directory
   },
   filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`); // generate a unique filename
   },
});

// Initialize multer with the storage engine
export const upload = multer({
   storage: storage,
   fileFilter: function (req, file, cb) {
      const filetypes = /jpeg|jpg|png|gif|mp4|mov/; // accepted file types
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(
         path.extname(file.originalname).toLowerCase(),
      );

      if (mimetype && extname) {
         return cb(null, true);
      } else {
         cb(new Error("Only image and video files are allowed!"));
      }
   },
});

export const uploadErrorHandler = (
   err: any,
   request: Request,
   response: Response,
   next: NextFunction,
) => {
   if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return response.status(400).json({ error: err.message });
   } else if (err) {
      // An unknown error occurred when uploading.
      return response
         .status(500)
         .json({ error: "An unknown error occurred during the file upload." });
   }
   next();
};
