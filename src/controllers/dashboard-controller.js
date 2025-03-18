import { db } from "../models/db.js";

export const dashboardController = {

    index : {
        handler: async function (request, h) {
            return h.view("dashboard-view", {title: "My Dashboard"})
        }
    },



}