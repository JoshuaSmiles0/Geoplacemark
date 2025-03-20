import { db } from "../models/db.js";
import { storeUtils } from "../models/utils.js";



export const ratingController = {

    index: {
        handler: async function (request, h) {
            const poi = await db.poiStore.getPoiById(request.params.id);
            const ratings = await db.ratingStore.getRatingsByPoiId(request.params.id);
            const averageRating = storeUtils.getAverageRating(ratings);
            const viewData = {
                title: `${poi.location} Geosite`,
                poi: poi,
                ratings: ratings,
                averageRatingImage : storeUtils.getRatingIcon(String(averageRating)),
            }
            return h.view("poi-view", viewData);
        }
    },

    filterRatings: {
        handler: async function (request, h) {
            const poi = await db.poiStore.getPoiById(request.params.id);
            const ratings = await db.ratingStore.getRatingsByPoiId(request.params.id);
            const filteredRatings = await db.ratingStore.getRatingsByPoiIdRating(poi._id, request.payload.rating)
            const averageRating = storeUtils.getAverageRating(ratings); 
            const viewData = {
                title: `${poi.location} Geosite`,
                poi: poi,
                ratings: filteredRatings,
                averageRatingImage : storeUtils.getRatingIcon(String(averageRating)),
            }
            return h.view("poi-view", viewData);
        }
    },


    publicRatings: {
        handler: async function (request, h) {
            const poi = await db.poiStore.getPoiById(request.params.id);
            const ratings = await db.ratingStore.getRatingsByPoiId(request.params.id);
            const averageRating = storeUtils.getAverageRating(ratings);
            const viewData = {
                title: `${poi.location} Geosite`,
                poi: poi,
                ratings: ratings,
                averageRatingImage : storeUtils.getRatingIcon(String(averageRating)),
            }
            return h.view("public-poi-view", viewData);
        }
    },

    filterPublicRatings: {
        handler: async function (request, h) {
            const poi = await db.poiStore.getPoiById(request.params.id);
            const ratings = await db.ratingStore.getRatingsByPoiId(request.params.id);
            const filteredRatings = await db.ratingStore.getRatingsByPoiIdRating(poi._id, request.payload.rating)
            const averageRating = storeUtils.getAverageRating(ratings); 
            const viewData = {
                title: `${poi.location} Geosite`,
                poi: poi,
                ratings: filteredRatings,
                averageRatingImage : storeUtils.getRatingIcon(String(averageRating)),
            }
            return h.view("public-poi-view", viewData);
        }
    },

    

    addRating: {
        handler: async function (request,h) {
            const poi = await db.poiStore.getPoiById(request.params.id);
            const loggedInUser = request.auth.credentials;
            const userDetails = await db.userStore.getUserById(loggedInUser._id)
            const rating = {
                comment : request.payload.comment,
                rating : request.payload.rating,
                user : `${userDetails.firstName} ${userDetails.surname}`,
                ratingIconAddress : storeUtils.getRatingIcon(request.payload.rating)
            };
            await db.ratingStore.addRating(poi._id, loggedInUser._id, rating);
            return h.redirect(`/publicPoi/${poi._id}`);
        }
    }
}