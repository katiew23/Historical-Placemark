import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../models/db.js";

const result = dotenv.config();

export function createToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    role:
    user.email === "katiew23@gmail.com"
    ? "admin"
    : "user",
  };
  const options = {
    algorithm: "HS256",
    expiresIn: "1h",
  };
  return jwt.sign(payload, process.env.cookie_password, options);
}

export function decodeToken(token) {
  const userInfo = {};

  try {

    const decoded = jwt.verify(
      token,
      process.env.cookie_password
    );

    userInfo.userId = decoded.id;
    userInfo.email = decoded.email;
    userInfo.role = decoded.role;

  } catch (e) {
    console.log(e.message);
  }

  return userInfo;
}

export async function validate(decoded, request) {
  const user = await db.userStore.getUserById(decoded.id);
  if (!user) {
    return { isValid: false };
  }
  return { isValid: true, credentials: user };
}


// Utility functions for JWT authentication used by the API routes
// Handles creating tokens, decoding tokens, and validating the user
// createToken: generates a signed JWT when a user logs in using the user id and email
// decodeToken: verifies and reads the token payload so we can extract the user id and email
// validate: used by the Hapi JWT auth strategy to check the user still exists in the database