// src/controllers/post.controller.ts
import { Request, Response } from "express";
import { Post } from "../models/post.model";
import { User } from "../models/user.model";
import Joi from "joi";
import { ObjectId } from "mongoose";

export const createPost = async (request: Request, response: Response) => {
  try {
    const schema = Joi.object({
      text: Joi.string().required().max(500),
    });

    const { error } = schema.validate(request.body, { abortEarly: true });
    if (error) {
      return response.status(400).json({ message: error.details[0].message });
    }

    const { text } = request.body;

    let attachments: string[] = [];
    if (request.files) {
      attachments = (request.files as Express.Multer.File[]).map((file) => file.path);
    }
    const newPost = new Post({ text: text, attachments: attachments, author: request.user?._id });
    await newPost.save();
    return response.status(201).json({ message: "Post created successfully.", post: newPost });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Error creating post." });
  }
};

export const getPost = async (request: Request, response: Response) => {
  try {
    const { postId } = request.params;
    const post = await Post.findById(postId).populate("author", "username email");
    return response.status(200).json({ message: "Post created successfully.", post });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Error getting post." });
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
    await Post.findByIdAndUpdate(postId, { $addToSet: { likes: request.user?._id } });
    return response.status(200).json({ message: "Post liked successfully." });
  } catch (error) {
    response.status(400).json({ error: "Error liking post." });
  }
};

export const commentOnPost = async (request: Request, response: Response) => {
  try {
    const postId = request.params.postId;
    const schema = Joi.object({
      text: Joi.string().required().max(500),
    });

    const { error } = schema.validate(request.body, { abortEarly: true });
    if (error) {
      return response.status(400).json({ message: error.details[0].message });
    }
    const { text } = request.body;
    const comment = { userId: request.user?._id, text, createdAt: new Date() };
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment } });
    response.status(200).json({ message: "Comment added successfully.", comment });
  } catch (error) {
    response.status(400).json({ error: "Error adding comment." });
  }
};
