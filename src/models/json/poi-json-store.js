import { v4 } from "uuid";
import { db } from "./store-utils.js";

export const poiJsonStore = {

    async getAllPoi() {
        await db.read();
        return db.data.pois;
    },

    async deleteAllPoi() {
        db.data.pois = [];
        await db.write();
    },

    async addPoi(poi) {
        await db.read();
        poi._id = v4();
        db.data.pois.push(poi);
        await db.write();
        return poi;
    },

    async getPoiById(id) {
        await db.read();
        let p = db.data.pois.find((poi) => poi._id === id);
        if (p === undefined) p = null;
        return p;
    },

    async getPoiByUserId(userid) {
        await db.read();
        let userP = db.data.pois.filter((poi) => poi.userid === userid);
        if (userP === undefined) userP = null;
        return userP;
    },

    async deletePoiByUserId(userId) {
        await db.read();
    },


    async deletePoiById(id) {
        await db.read();
        const index = db.data.pois.findIndex((poi) => poi._id === id);
        if (index !== -1) db.data.pois.splice(index, 1);
        await db.write();
      },

    async getPoiByType(type) {
        await db.read();
        let pType = db.data.pois.filter((poi) => poi.type === type);
        if (pType === undefined) pType = null;
        return pType;
    }







}