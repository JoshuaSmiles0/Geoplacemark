import { userJsonStore } from "./json/user-json-store.js";
import { poiJsonStore } from "./json/poi-json-store.js";
import { ratingJsonStore } from "./json/rating-json-store.js";
import { userMemStore } from "./mem/user-mem-store.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { ratingMongoStore } from "./mongo/rating-mongo-store.js";
import { poiMongoStore } from "./mongo/poi-mongo-store.js";
import { connectMongo } from "./mongo/connect.js";

// Method for initialising each database type based on input string 

export const db = {
    userStore : null,
    poiStore : null,
    ratingStore : null,


    init(storeType) {
        switch(storeType) {
            case "mem":
                this.userStore = userMemStore
            break;
            case "json": 
            this.userStore = userJsonStore;
            this.poiStore = poiJsonStore;
            this.ratingStore = ratingJsonStore;
            break;
            case "mongo":
            this.userStore = userMongoStore;
            this.poiStore = poiMongoStore;
            this.ratingStore = ratingMongoStore;
            connectMongo();
            break;
            default:
                this.userStore = userJsonStore;
                this.poiStore = poiJsonStore;
                this.ratingStore = ratingJsonStore;
        }
    },

};


