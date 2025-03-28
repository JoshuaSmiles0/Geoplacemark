import { v4 } from "uuid";
import { db } from "./store-utils.js";

// methods for writing user data to lowdb store

export const userJsonStore = {

async addUser(user) {
  await db.read();
  user._id = v4();
  db.data.users.push(user);
  await db.write();
  return user;
},


async deleteUserById(id) {
    await db.read();
    const index = db.data.users.findIndex((user) => user._id === id);
    if (index !== -1) db.data.users.splice(index, 1)
    await db.write();
  },


async deleteAllUsers() {
    db.data.users = [];
    await db.write();
},

async getAllUsers() {
    await db.read();
    return db.data.users;
},

async getUserByEmail(email) {
    await db.read();
    let u = db.data.users.find((user) => user.email === email)
    if (u === undefined) u = null;
    return u;
},

async getUserById(id) {
    await db.read()
    let u = db.data.users.find((user) => user._id === id)
    if (u === undefined) u = null;
    return u;
},

async updateUserDetails(user, updatedUser) {
    if(user !== null){
    user.firstName = updatedUser.firstName
    user.surname = updatedUser.surname
    user.email = updatedUser.email
    user.password = updatedUser.password
    await db.write()
};},

};