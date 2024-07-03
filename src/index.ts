// src/index.ts
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postRouter from "./routes/post.route";
import userRouter from "./routes/user.route";
import { config } from "dotenv";
config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use("/api/v1/posts/", postRouter);
app.use("/api/v1/users/", userRouter);

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
