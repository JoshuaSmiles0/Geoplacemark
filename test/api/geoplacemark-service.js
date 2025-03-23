import axios from "axios";
import { serviceUrl } from "../apiFixtures.js";

export const geoplacemarkService = {

    geoplacemarkUrl : serviceUrl,

    async createUser(user) {
        const res = await axios.post(`${this.geoplacemarkUrl}/api/users`, user)
        return res.data
    },

    async getAllUsers() {
        const res = await axios.get(`${this.geoplacemarkUrl}/api/users`)
        return res.data
    },

    async deleteAllUsers() {
        const res = await axios.delete("http://localhost:3000/api/users")
        return res.data
    },

    async getUserById(id) {
        const res = await axios.get(`${this.geoplacemarkUrl}/api/users/${id}`)
        return res.data
    },

    async deleteUserById(id) {
        const res = await axios.delete(`${this.geoplacemarkUrl}/api/users/${id}`)
        return res.data
    },

    async updateUser(id, updatedUser) {
        const res = await axios.put(`${this.geoplacemarkUrl}/api/users/${id}`, updatedUser)
        return res.data
    }

}