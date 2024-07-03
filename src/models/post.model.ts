import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
   author: mongoose.Types.ObjectId;
   text: string;
   attachments: string[];
   likes: mongoose.Types.ObjectId[];
   comments: {
      userId: mongoose.Types.ObjectId;
      text: string;
      createdAt: Date;
   }[];
   createdAt: Date;
}

const PostSchema: Schema = new Schema({
   author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   text: { type: String, required: true },
   attachments: [{ type: String }],
   likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
   comments: [
      {
         userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
         text: String,
         createdAt: { type: Date, default: Date.now },
      },
   ],
   createdAt: { type: Date, default: Date.now },
});

export const Post = mongoose.model<IPost>("Post", PostSchema);
