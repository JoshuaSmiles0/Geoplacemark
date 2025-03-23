import { db } from "../models/db.js";
import { poiSchema } from "../models/joi-schemas.js";
import { storeUtils } from "../models/utils.js";

// Controls user specific dashboard user sites

export const dashboardController = {

    // Renders users dashboard populated with users sites
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

    // Constructs a new Poi from passed details payload and logged in user
    // and adds this to the db. Icon address retrieved using util method on type
    //  If Joi validation violated, redirects user to 
    // error view displaying validation errors
    addPoi : {
        validate : {
            payload : poiSchema,
            options : { abortEarly : false},
            failAction : function (request, h, error) {
                return h.view("error-view", {title: "failed to add poi, please try again", errors: error.details }).takeover().code(400)
                },
            },
        handler: async function (request, h) {
            const loggedInUser = request.auth.credentials
            const user = await db.userStore.getUserById(loggedInUser._id);
            const newPoi = {
                location : request.payload.location,
                lat :  request.payload.lat,
                long : request.payload.long,
                type : request.payload.type,
                description: request.payload.description,
                userid: loggedInUser._id,
                author: `${user.firstName} ${user.surname}`,
                iconAddress: storeUtils.getTypeIcon(request.payload.type)
            };
            await db.poiStore.addPoi(newPoi);
            return h.redirect("/dashboard");
        },
    },


    // Used to filter user dashboard by site type. Retrieves pois by 
    // logged in user and passed type. Re renders dashboard view only displaying 
    // filtered list
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

    // deletes a poi by passed id param. Deletes poi and associated ratings. Redirects to 
    // user dashboard
    deletePoi : {
        handler: async function (request, h) {
            const poi = await db.poiStore.getPoiById(request.params.id);
            await db.ratingStore.deleteRatingsByPoiId(poi._id);
            await db.poiStore.deletePoiById(poi._id);
            return h.redirect("/dashboard")
        }
    },
    
    // redirects user to update page displaying current poi details and a form to 
    // update this
    showUpdatePoi: {
        handler: async function (request, h) {
            const poi = await db.poiStore.getPoiById(request.params.id);
            const viewData = {
                title : "Update Poi Details",
                poi : poi
            }
            return h.view("update-poi-view", viewData);
        } 
    },

    // constructs new details object from passed parameters and calls get icon type
    // util on type to retrieve image path based on type. Updates poi and also associated
    // ratings. Redirects user to personal dashboard. If joi validation violated on update
    // redirects user to error page displaying errors
    updatePoi: {
        validate : {
            payload : poiSchema,
            options : { abortEarly : false},
            failAction : function (request, h, error) {
                return h.view("error-view", {title: "failed to add poi, please try again", errors: error.details }).takeover().code(400)
                },
            },
        handler: async function (request, h) {
            const poi = await db.poiStore.getPoiById(request.params.id);
            const newDetails = {
                location : request.payload.location,
                lat : request.payload.lat,
                long : request.payload.long,
                type : request.payload.type,
                description : request.payload.description,
                iconAddress : storeUtils.getTypeIcon(request.payload.type)
            }
            await db.poiStore.updatePoi(poi, newDetails);
            const updatedPoi = await db.poiStore.getPoiById(request.params.id);
            await db.ratingStore.updateRatingPoi(updatedPoi);
            return h.redirect("/dashboard")
        }
    },
};