import axios from "axios";
import { serviceUrl } from "../apiFixtures.js";

export const geoplacemarkService = {

    geoplacemarkUrl : serviceUrl,


    async authenticate(user) {
        const response = await axios.post(`${this.geoplacemarkUrl}/api/users/authenticate`, user);
        axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
        return response.data;
      },
    
      async clearAuth() {
        axios.defaults.headers.common["Authorization"] = "";
      },

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
    },

    async createPoi(poi) {
        const res = await axios.post(`${this.geoplacemarkUrl}/api/pois`, poi)
        return res.data
    },

    async getAllPois() {
        const res = await axios.get(`${this.geoplacemarkUrl}/api/pois`)
        return res.data
    },

    async deleteAllPois() {
        const res = await axios.delete(`${this.geoplacemarkUrl}/api/pois`)
        return res.data
    },

    async getPoiById(id) {
        const res = await axios.get(`${this.geoplacemarkUrl}/api/pois/${id}`)
        return res.data
    },

    async getPoiByUserId(userid) {
        const res = await axios.get(`${this.geoplacemarkUrl}/api/pois/user/${userid}`)
        return res.data
    },

    async getPoiByType(type) {
        const res = await axios.get(`${this.geoplacemarkUrl}/api/pois/type/${type}`)
        return res.data
    },

    async deletePoiById(id) {
        const res = await axios.delete(`${this.geoplacemarkUrl}/api/pois/${id}`)
        return res.data
    },

    async deletePoiByUserId(userid) {
        const res = await axios.delete(`${this.geoplacemarkUrl}/api/pois/user/${userid}`)
        return res.data
    },

    async updatePoi(id, newDetails) {
        const res = await axios.put(`${this.geoplacemarkUrl}/api/pois/${id}`, newDetails)
        return res.data
    },

    async createRating(poiid,userid,rating) {
        const res = await axios.post(`${this.geoplacemarkUrl}/api/ratings/${poiid}/${userid}`, rating)
        return res.data
    },

    async getAllRatings() {
        const res = await axios.get(`${this.geoplacemarkUrl}/api/ratings`)
        return res.data
    },

    async deleteAllRatings() {
        const res = await axios.delete(`${this.geoplacemarkUrl}/api/ratings`)
        return res.data
    },

    async getRatingById(id) {
        const res = await axios.get(`${this.geoplacemarkUrl}/api/ratings/${id}`)
        return res.data
    },

    async getRatingByUserId(userid) {
        const res = await axios.get(`${this.geoplacemarkUrl}/api/ratings/user/${userid}`)
        return res.data
    },

    async getRatingByValue(value) {
        const res = await axios.get(`${this.geoplacemarkUrl}/api/ratings/rating/${value}`)
        return res.data
    },

    async getRatingByPoiId(poiid) {
        const res = await axios.get(`${this.geoplacemarkUrl}/api/ratings/poi/${poiid}`)
        return res.data
    },

    async deleteRatingById(id) {
        const res = await axios.delete(`${this.geoplacemarkUrl}/api/ratings/${id}`)
        return res.data
    },

    async deleteRatingByUserId(userid) {
        const res = await axios.delete(`${this.geoplacemarkUrl}/api/ratings/user/${userid}`)
        return res.data
    },

    async deleteRatingByPoiId(poiid) {
        const res = await axios.delete(`${this.geoplacemarkUrl}/api/ratings/poi/${poiid}`)
        return res.data
    },

    async updateRating(id, newDetails) {
        const res = await axios.put(`${this.geoplacemarkUrl}/api/ratings/${id}`, newDetails)
        return res.data
    },


}