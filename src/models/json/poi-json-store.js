import { v4 } from "uuid";
import { db } from "./store-utils.js";

// methods for writing poi data to lowdb store

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

    async deletePoiByUserId(userid) {
        await db.read();
        const pois = db.data.pois;
        pois.forEach(poi => {
            if(poi.userid === userid){
                const id = poi._id
                const index = db.data.pois.findIndex((poi) => poi._id === id);
                db.data.pois.splice(index, 1);
            }
        });
        await db.write();
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
    },

    async getPoiByUserIdType(userid, type) {
        await db.read();
        const userP = db.data.pois.filter((poi) => poi.userid === userid);
        let userPType = userP.filter((userP) => userP.type === type);
        if (userPType === undefined) userPType = null;
        return userPType;
    },


    async updatePoi(poi, updatedPoi) {
        if(poi !== null){
            poi.location = updatedPoi.location
            poi.lat = updatedPoi.lat
            poi.long = updatedPoi.long
            poi.type = updatedPoi.type
            poi.description = updatedPoi.description
            await db.write()
    }
},
};