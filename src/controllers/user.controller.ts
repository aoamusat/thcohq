// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { User } from "../models/user.model";
import { RedisCache } from "../config/redis";

export const followUser = async (request: Request, response: Response) => {
   try {
      const userId = request.user;
      const userToFollow = await User.findOne({
         username: request.params.username,
      });
      if (!userToFollow) {
         return response.status(404).json({ message: "User not found!" });
      }

      if (request.user?.username === userToFollow?.username) {
         return response
            .status(400)
            .json({ message: "You are not allowed to follow yourself." });
      }

      const userToFollowId = userToFollow?.id;
      await User.findByIdAndUpdate(userId, {
         $addToSet: { following: userToFollowId },
      });
      await User.findByIdAndUpdate(userToFollowId, {
         $addToSet: { followers: userId },
      });
      response.status(200).json({ message: "User followed successfully." });
   } catch (error) {
      console.log(error);
      response.status(500).json({ error: "Error following user." });
   }
};

export const unfollowUser = async (request: Request, response: Response) => {
   try {
      const userId = request.user?.id;
      const userToUnfollow = await User.findOne({
         username: request.params.username,
      });
      if (!userToUnfollow) {
         return response.status(404).json({ message: "User not found!" });
      }

      if (request.user?.username === userToUnfollow?.username) {
         return response
            .status(400)
            .json({ message: "You are not allowed to unfollow yourself." });
      }

      const userToUnfollowId = userToUnfollow?.id;
      await User.findByIdAndUpdate(userId, {
         $pull: { following: userToUnfollowId },
      });
      await User.findByIdAndUpdate(userToUnfollowId, {
         $pull: { followers: userId },
      });
      response.status(200).json({ message: "User unfollowed successfully." });
   } catch (error) {
      console.log(error);
      response.status(500).json({ error: "Error unfollowing user." });
   }
};

export const getUserProfile = async (request: Request, response: Response) => {
   try {
      const cachedProfile = await RedisCache.get(
         `user.profile.${request.params.username}`,
      );

      if (cachedProfile) {
         return response.status(200).json(JSON.parse(cachedProfile));
      }
      const user = await User.findOne(
         { username: request.params.username },
         { password: false, _id: false, __v: false },
      ).populate("followers following", "username email");
      if (!user) {
         return response.status(404).json({ message: "User not found!" });
      }
      response.status(200).json(user);
      await RedisCache.set(
         `user.profile.${request.params.username}`,
         JSON.stringify(user),
         { EX: 24 * 60 * 60 },
      );
   } catch (error) {
      console.log(error);
      response.status(500).json({ error: "Error fetching user profile." });
   }
};
