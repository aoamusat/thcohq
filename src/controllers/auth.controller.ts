// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import Joi from "joi";
import { config } from "dotenv";
config();

export const register = async (request: Request, response: Response) => {
  const RegisterSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }).unknown();

  const { error } = RegisterSchema.validate(request.body, { abortEarly: true });
  if (error) {
    return response.status(400).json({ message: error.details[0].message });
  }
  try {
    const { username, email, password } = request.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return response.status(400).json({ message: "Username or email already exists" });
    }

    const newUser = new User({ username, email, password: password });

    await newUser.save();

    const token = jwt.sign({ ...newUser }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

    response.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    response.status(500).json({ message: "Error registering user", error });
  }
};

export const login = async (request: Request, response: Response) => {
  try {
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = loginSchema.validate(request.body, { abortEarly: true });
    if (error) {
      return response.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = request.body;
    const user = await User.findOne({ email: email });
    const checkPassword = await bcrypt.compare(password, user?.password || "");
    if (!user || !checkPassword) {
      return response.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign({ ...user.toJSON() }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
    response.status(200).json({ token });
  } catch (error) {
    console.log(error);
    response.status(400).json({ error: "Error logging in." });
  }
};
