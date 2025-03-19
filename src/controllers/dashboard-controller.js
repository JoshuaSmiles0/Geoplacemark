import { db } from "../models/db.js";
import { poiSchema } from "../models/joi-schemas.js";
import { storeUtils } from "../models/utils.js";

export const dashboardController = {

    index : {
        handler: async function (request, h) {
            const loggedInUser = request.auth.credentials;
            const userPois = await db.poiStore.getPoiByUserId(loggedInUser._id);
            const viewData = {
                title: `${loggedInUser.firstName} ${loggedInUser.surname} Dashboard`,
                pois: userPois,
            }
            return h.view("dashboard-view", viewData)
        }
    },


    addPoi : {
        validate : {
            payload : poiSchema,
            options : { abortEarly : false},
            failAction : function (request, h, error) {
                return h.view("dashboard-view", {title: "dashboard error, please try again", errors: error.details }).takeover().code(400)
                },
            },
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


    
    filterPois : {
        handler: async function (request, h) {
            const loggedInUser = request.auth.credentials;
            const userPoisType = await db.poiStore.getPoiByUserIdType(loggedInUser._id, request.payload.type);
            const viewData = {
                title: `${loggedInUser.firstName} ${loggedInUser.surname} Dashboard`,
                pois: userPoisType,
            }
            return h.view("dashboard-view", viewData)
        }
    },
};