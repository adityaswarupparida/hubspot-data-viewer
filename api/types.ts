import z from "zod";

export const UserSchema = z.object({
  username: z.string(),
  password: z.string().min(3).max(15)
});

export type TokenResponse = {
  "refresh_token": string;
  "access_token": string;
  "expires_in": number;
}