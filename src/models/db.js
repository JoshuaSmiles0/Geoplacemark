import { userJsonStore } from "./json/user-json-store.js";
import { poiJsonStore } from "./json/poi-json-store.js";
import { userMemStore } from "./mem/user-mem-store.js";


export const db = {
    userStore : null,
    poiStore : null,


    init() {
        // this.userStore = userMemStore;
        this.userStore = userJsonStore;
        this.poiStore = poiJsonStore;
    },

};


