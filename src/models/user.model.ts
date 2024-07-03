// src/models/user.model.ts
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
   username: string;
   email: string;
   password: string;
   followers: mongoose.Types.ObjectId[];
   following: mongoose.Types.ObjectId[];
   comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
   username: { type: String, required: true, unique: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
   following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

UserSchema.pre<IUser>("save", async function (next) {
   if (!this.isModified("password")) return next();
   this.password = await bcrypt.hash(this.password, 10);
   next();
});

UserSchema.methods.comparePassword = async function (
   password: string,
): Promise<boolean> {
   return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);
