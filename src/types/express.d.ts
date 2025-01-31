import { Request } from "express";
import { IUser } from "../models/user.model";
import { JwtPayload } from "jsonwebtoken";

declare global {
   namespace Express {
      interface Request {
         user?: IUser;
      }
   }
}
