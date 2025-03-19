import { db } from "../models/db.js";
import { storeUtils } from "../models/utils.js";

export const dashboardController = {

    index : {
        handler: async function (request, h) {
            const loggedInUser = request.auth.credentials;
            const userPois = await db.poiStore.getPoiByUserId(loggedInUser._id);
            const viewData = {
                title: `${loggedInUser.firstName + " " + loggedInUser.surname} Dashboard`,
                pois: userPois,
            }
            return h.view("dashboard-view", viewData)
        }
    },


    addPoi : {
        handler: async function (request, h) {
            const loggedInUser = request.auth.credentials
            const newPoi = {
                location : request.payload.location,
                lat :  request.payload.lat,
                long : request.payload.long,
                type : request.payload.type,
                description: request.payload.description,
                userid: loggedInUser._id,
                iconAddress: storeUtils.getTypeIcon(request.payload.type)
            };
            await db.poiStore.addPoi(newPoi);
            return h.redirect("/dashboard");
        },
    },



};