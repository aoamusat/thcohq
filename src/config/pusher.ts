import { config } from "dotenv";
import Pusher from "pusher";
config();

export const pusher = new Pusher({
   appId: process.env.PUSHER_APP_ID || "",
   key: process.env.PUSHER_KEY || "",
   secret: process.env.PUSHER_SECRET || "",
   cluster: "eu",
   useTLS: true,
});
