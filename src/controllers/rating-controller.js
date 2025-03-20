import { db } from "../models/db.js";
import { storeUtils } from "../models/utils.js";



export const ratingController = {

    index: {
        handler: async function (request, h) {
            const poi = await db.poiStore.getPoiById(request.params.id);
            const ratings = await db.ratingStore.getRatingsByPoiId(request.params.id);
            const averageRating = storeUtils.getAverageRating(ratings);
            const ratingLabels = ["1","2","3","4","5"];
            const ratingMetrics = [0,0,0,0,0];
              for (let i = 0; i < ratings.length; i+=1) {
                const ratingValue = ratings[i].rating;
                switch(ratingValue) {
                case "1":
                  ratingMetrics[0] += 1;
                break;
                case "2":
                  ratingMetrics[1] += 1;;
                break;
                case "3":
                  ratingMetrics[2] += 1;;
                break;
                case "4":
                  ratingMetrics[3] += 1;;
                break;
                case "5":
                  ratingMetrics[4] += 1;;
                break;
                default:
                  ratingMetrics[0] += 1;;
                }
              };
            
            const viewData = {
                title: `${poi.location} Geosite`,
                poi: poi,
                ratings: ratings,
                averageRatingImage : storeUtils.getRatingIcon(String(averageRating)),
                ratingLabels: ratingLabels,
                ratingMetrics: ratingMetrics,
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
            const ratingLabels = ["1","2","3","4","5"];
            const ratingMetrics = [0,0,0,0,0];
              for (let i = 0; i < ratings.length; i+=1) {
                const ratingValue = ratings[i].rating;
                switch(ratingValue) {
                case "1":
                  ratingMetrics[0] += 1;
                break;
                case "2":
                  ratingMetrics[1] += 1;;
                break;
                case "3":
                  ratingMetrics[2] += 1;;
                break;
                case "4":
                  ratingMetrics[3] += 1;;
                break;
                case "5":
                  ratingMetrics[4] += 1;;
                break;
                default:
                  ratingMetrics[0] += 1;;
                }
              }; 
            const viewData = {
                title: `${poi.location} Geosite`,
                poi: poi,
                ratings: filteredRatings,
                averageRatingImage : storeUtils.getRatingIcon(String(averageRating)),
                ratingLabels: ratingLabels,
                ratingMetrics: ratingMetrics,
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
            const date = new Date()
            const rating = {
                comment : request.payload.comment,
                rating : request.payload.rating,
                user : `${userDetails.firstName} ${userDetails.surname}`,
                ratingIconAddress : storeUtils.getRatingIcon(request.payload.rating),
                date: date.toISOString().replace("T", " ").replace("Z", " "),
            };
            await db.ratingStore.addRating(poi._id, loggedInUser._id, rating);
            return h.redirect(`/publicPoi/${poi._id}`);
        }
    },

    deleteRating: {
        handler: async function (request, h) {
            const poi = await db.poiStore.getPoiById(request.params.poiId);
            await db.ratingStore.deleteRatingById(request.params.ratingId);
            return h.redirect(`/poi/${poi._id}`);
        }

    }
}