import { v4 } from "uuid";
import { db } from "./store-utils.js";

// methods for writing rating data to lowdb store

export const ratingJsonStore = {

    async getAllRatings() {
        await db.read();
        return db.data.ratings;
    },

    async deleteAllRatings() {
        db.data.ratings = [];
        await db.write();
    },

    async addRating(poiId,userId, rating) {
        await db.read();
        rating._id = v4();
        rating.poiid = poiId;
        rating.userid = userId;
        db.data.ratings.push(rating);
        await db.write();
        return rating;
    },

    async getRatingsByUserId(userId) {
        await db.read();
        let userR = db.data.ratings.filter((rating) => rating.userid === userId);
        if (userR === undefined) userR = null;
        return userR;
    },

    async getRatingsByPoiId(poiId) {
        await db.read();
        let poiR = db.data.ratings.filter((rating) => rating.poiid === poiId);
        if (poiR === undefined) poiR = null;
        return poiR;
    },

    async getRatingsByRatingValue(value) {
        await db.read();
        let rR = db.data.ratings.filter((rating) => rating.rating === value);
        if (rR === undefined) rR = null;
        return rR;
    },

    async getRatingsByPoiIdRating(poiid, rating) {
        await db.read();
        const ratingP = db.data.ratings.filter((rating) => rating.poiid === poiid);
        let ratingPRatings = ratingP.filter((ratingP) => ratingP.rating === rating);
        if (ratingPRatings === undefined) ratingPRatings = null;
        return ratingPRatings;
    },

    async getRatingById(id) {
        await db.read();
        let r = db.data.ratings.find((rating) => rating._id === id);
        if (r === undefined) r = null;
        return r;
    },

    async deleteRatingById(id) {
        await db.read();
        const index = db.data.ratings.findIndex((rating) => rating._id === id);
        if (index !== -1) db.data.ratings.splice(index, 1);
        await db.write();
    },

    async deleteRatingsByUserId(userId) {
        await db.read();
        const ratings = db.data.ratings;
        ratings.forEach(rating => {
            if(rating.userid === userId){
                const id = rating._id
                const index = db.data.ratings.findIndex((rating) => rating._id === id);
                db.data.ratings.splice(index, 1);
            }
        });
        await db.write();
    },

    async deleteRatingsByPoiId(poiId) {
        await db.read();
        const ratings = db.data.ratings;
        ratings.forEach(rating => {
            if(rating.poiid === poiId){
                const id = rating._id
                const index = db.data.ratings.findIndex((rating) => rating._id === id);
                db.data.ratings.splice(index, 1);
            }
        });
        await db.write();

    },

    async updateRating(rating,updatedRating){
        if(rating !== null){
            rating.comment = updatedRating.comment
            rating.rating = updatedRating.rating
            rating.ratingIconAddress = updatedRating.ratingIconAddress
            rating.date = updatedRating.date
            await db.write()
    }
},
};
