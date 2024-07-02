// src/controllers/post.controller.ts
import { Request, Response } from "express";
import { Post } from "../models/post.model";
import { User } from "../models/user.model";

export const createPost = async (request: Request, response: Response) => {
  try {
    const { text, attachments } = request.body;
    // @ts-ignore
    const newPost = new Post({ author: request.user?.id, text, attachments });
    await newPost.save();
    return response.status(201).json({ message: "Post created successfully.", post: newPost });
  } catch (error) {
    return response.status(400).json({ error: "Error creating post." });
  }
};

export const getFeed = async (request: Request, response: Response) => {
  try {
    const user = await User.findOne({ email: request.user?.email });
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 10;
    const posts = await Post.find({ author: { $in: user?.following } })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("author", "username email");
    response.status(200).json(posts);
  } catch (error) {
    response.status(400).json({ error: "Error fetching feed." });
  }
};

export const likePost = async (request: Request, response: Response) => {
  try {
    const postId = request.params.postId;
    await Post.findByIdAndUpdate(postId, { $addToSet: { likes: request.user?.id } });
    return response.status(200).json({ message: "Post liked successfully." });
  } catch (error) {
    response.status(400).json({ error: "Error liking post." });
  }
};

export const commentOnPost = async (request: Request, response: Response) => {
  try {
    const postId = request.params.postId;
    const { text } = request.body;
    const comment = { userId: request.user?.id, text, createdAt: new Date() };
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment } });
    response.status(200).json({ message: "Comment added successfully.", comment });
  } catch (error) {
    response.status(400).json({ error: "Error adding comment." });
  }
};
