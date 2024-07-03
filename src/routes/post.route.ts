// src/routes/post.route.ts
import express from "express";
import { createPost, getFeed, likePost, commentOnPost, getPost } from "../controllers/post.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Post routes
router.post("/", authMiddleware, createPost);
router.get("/:postId", authMiddleware, getPost);
router.get("/feed", authMiddleware, getFeed);
router.post("/:postId/like", authMiddleware, likePost);
router.post("/:postId/comments", authMiddleware, commentOnPost);

export default router;
