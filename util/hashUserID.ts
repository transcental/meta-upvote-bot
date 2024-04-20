import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

export const hashUserId = (id: string) => {
  return crypto.createHash("sha256").update(id).digest("base64");
};
