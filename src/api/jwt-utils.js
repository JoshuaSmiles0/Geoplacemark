import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../models/db.js";

const result = dotenv.config();

/**
 * Takes a user object as parameter
 * creates a payload from user details
 * encryption algorithm hard coded
 * creates jwt token and returns it
*/
export function createToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
  };
  const options = {
    algorithm: "HS256",
    expiresIn: "1h",
  };
  return jwt.sign(payload, process.env.cookie_password, options);
}

/**
 * Takes JWT token as parameter
 * Attempts to decode token and expose
 * contents into new userinfo variable
 * and return it. If error, logs error
 * message to console
 */
export function decodeToken(token) {
  const userInfo = {};
  try {
    const decoded = jwt.verify(token, process.env.cookie_password);
    userInfo.userId = decoded.id;
    userInfo.email = decoded.email;
  } catch (e) {
    console.log(e.message);
  }
  return userInfo;
}

/**
 * Takes result of decodeToken function
 * attempts to locate user in userStore
 * where decoded id matches userid. if
 * user not located, isValid false returned
 * otherwise isValid true
 */
export async function validate(decoded, request) {
  const user = await db.userStore.getUserById(decoded.id);
  if (!user) {
    return { isValid: false };
  }
  return { isValid: true, credentials: user };
}