import Mongoose from "mongoose";
import { User } from "./user.js";

// methods for writing user data to mongo

export const userMongoStore = {

async addUser(user) {
    const addUser = new User(user);
    const userObj = await addUser.save();
    const u = await this.getUserById(userObj._id);
    return u;
  },


async deleteUserById(id) {
    try {
        await User.deleteOne({ _id: id });
      } catch (error) {
        console.log("bad id");
      }
    },


async deleteAllUsers() {
        await User.deleteMany({});
},

async getAllUsers() {
    const users = await User.find().lean();
    return users;
  },

async getUserByEmail(email) {
    const user = await User.findOne({ email: email }).lean();
    return user;
},

async getUserById(id) {
    if (Mongoose.isValidObjectId(id)) {
        const user = await User.findOne({ _id: id }).lean();
        return user;
      }
      return null;
    },

async updateUserDetails(user, updatedUser) {
    try {
    await User.updateOne({_id:{$eq:user._id}},
    { firstName :updatedUser.firstName, surname : updatedUser.surname, email: updatedUser.email, password : updatedUser.password})
}
    catch (error) {
        console.log("Issue with user")

    }},
};