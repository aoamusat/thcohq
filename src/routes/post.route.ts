// src/routes/post.route.ts
import express from "express";
import { createPost, getFeed, likePost, commentOnPost } from "../controllers/post.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Post routes
router.post("/posts", authMiddleware, createPost);
router.get("/feed", authMiddleware, getFeed);
router.post("/posts/:postId/like", authMiddleware, likePost);
router.post("/posts/:postId/comments", authMiddleware, commentOnPost);

export default router;
