import { v4 } from "uuid";

// Methods for writing user data to in memory store

let users = [];

export const userMemStore = {

async addUser(user) {
  user._id = v4();
  users.push(user);
  return user;
},


async deleteUserById(id) {
    const index = users.find((user) => user.id === id);
    users.splice(index,1);
},


async deleteAllUsers() {
    users = [];
},

async getAllUsers() {
    return users;
},

async getUserByEmail(email) {
    return users.find((user) => user.email === email)
},

async getUserById(id) {
    return users.find((user) => user._id === id)
}

};