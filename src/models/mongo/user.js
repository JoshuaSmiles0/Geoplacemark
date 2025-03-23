import Mongoose from "mongoose";

// Mongo schema for db user objects

const { Schema } = Mongoose;

const userSchema = new Schema({
  firstName: String,
  surname: String,
  email: String,
  password: String,
});

export const User = Mongoose.model("User", userSchema);