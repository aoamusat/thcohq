// src/controllers.ts
import { Request, Response } from "express";
import { User } from "../models/user.model";

export const followUser = async (request: Request, response: Response) => {
  try {
    const userId = request.user;
    const userToFollowId = request.params.id;
    await User.findByIdAndUpdate(userId, { $addToSet: { following: userToFollowId } });
    await User.findByIdAndUpdate(userToFollowId, { $addToSet: { followers: userId } });
    response.status(200).json({ message: "User followed successfully." });
  } catch (error) {
    response.status(400).json({ error: "Error following user." });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userToUnfollowId = req.params.id;
    await User.findByIdAndUpdate(userId, { $pull: { following: userToUnfollowId } });
    await User.findByIdAndUpdate(userToUnfollowId, { $pull: { followers: userId } });
    res.status(200).json({ message: "User unfollowed successfully." });
  } catch (error) {
    res.status(400).json({ error: "Error unfollowing user." });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).populate("followers following", "username email");
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: "Error fetching user profile." });
  }
};
