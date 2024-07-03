// src/routes/post.route.ts
import express from "express";
import {
   createPost,
   getFeed,
   likePost,
   commentOnPost,
   getPost,
} from "../controllers/post.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { upload, uploadErrorHandler } from "../middleware/upload.middleware";

const router = express.Router();

// Post routes
router.post(
   "/",
   authMiddleware,
   upload.array("attachments", 5),
   uploadErrorHandler,
   createPost,
);
router.get("/:postId", authMiddleware, getPost);
router.get("/user/feeds", authMiddleware, getFeed);
router.post("/:postId/like", authMiddleware, likePost);
router.post("/:postId/comments", authMiddleware, commentOnPost);

export default router;
