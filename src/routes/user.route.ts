// src/routes/user.route.ts
import express from "express";
import { register, login } from "../controllers/auth.controller";
import { followUser, unfollowUser, getUserProfile } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// User routes
router.post("/register", register);
router.post("/login", login);
router.post("/follow/:id", authMiddleware, followUser);
router.post("/unfollow/:id", authMiddleware, unfollowUser);
router.get("/profile/:id", authMiddleware, getUserProfile);

export default router;
