import { userJsonStore } from "./json/user-json-store.js";
import { userMemStore } from "./mem/user-mem-store.js";


export const db = {
    userStore : null,


    init() {
        // this.userStore = userMemStore;
        this.userStore = userJsonStore;
    },

};


