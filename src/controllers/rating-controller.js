import { db } from "../models/db.js";
import { storeUtils } from "../models/utils.js";
import { ratingSchema } from "../models/joi-schemas.js";

// Controls individual site dashboards and ratings

export const ratingController = {


  // Renders user poi view. Creates arrays required for graph showing split
  // of ratings. Also retrieves average rating for site and image using utility method.
  // Also renders the pois details
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

    // Renders as above, but with ratings list filtered by passed type
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


    // Renders public poi view which allows users to post ratings to site
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
    
    // As above but with ratings filtered by passed rating value
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

    
    // Adds a rating to poi from public view. Constructs updated details from
    // logged in user details , the poi and user specified details. Uses util 
    // methods to retrieve image path for star rating. If joi schema violated, 
    // redirects user to error page displaying validation issues. Once rating
    // added, redirects user to public poi page
    addRating: {
        validate : {
                    payload : ratingSchema,
                    options : { abortEarly : false},
                    failAction : function (request, h, error) {
                        return h.view("error-view", {title: "rating error, please try again", errors: error.details }).takeover().code(400)
                        },
                    },
        handler: async function (request,h) {
            const poi = await db.poiStore.getPoiById(request.params.id);
            const loggedInUser = request.auth.credentials;
            const userDetails = await db.userStore.getUserById(loggedInUser._id)
            const date = new Date()
            const rating = {
                comment : request.payload.comment,
                rating : request.payload.rating,
                user : `${userDetails.firstName} ${userDetails.surname}`,
                locationName : poi.location,
                ratingIconAddress : storeUtils.getRatingIcon(request.payload.rating),
                date: date.toISOString().replace("T", " ").replace("Z", " "),
            };
            await db.ratingStore.addRating(poi._id, loggedInUser._id, rating);
            return h.redirect(`/publicPoi/${poi._id}`);
        }
    },

    // deletes a rating from private poi page. Redirects user to private page
    deleteRating: {
        handler: async function (request, h) {
            const poi = await db.poiStore.getPoiById(request.params.poiId);
            await db.ratingStore.deleteRatingById(request.params.ratingId);
            return h.redirect(`/poi/${poi._id}`);
        }

    },

    // renders user engagement page showing users ratings. Able to update and 
    // delete own ratings from page
    showUserEngagement: {
      handler: async function (request, h) {
        const loggedInUser = request.auth.credentials;
        const ratings = await db.ratingStore.getRatingsByUserId(loggedInUser._id);
        const viewData = {
          title : `${loggedInUser.firstName} ${loggedInUser.surname} Engagement`,
          ratings : ratings
        }
        return h.view("engagement-view", viewData);
      }
    },

    // Deletes a users rating by id from user engagement page and
    // redirects user to engagmenet page
    deleteUserEngagement: {
      handler: async function (request, h) {
        await db.ratingStore.deleteRatingById(request.params.id);
        return h.redirect("/engagement")
      }
    },

    // renders page for user to edit specifc rating
    showEditEngagement: {
      handler: async function (request, h) {
        const rating = await db.ratingStore.getRatingById(request.params.id);
            const viewData = {
                title : "Update Rating Details",
                rating : rating
            }
            return h.view("update-rating-view", viewData);
        } 
      },
    
    // Updates a users comment and redirects to engagment page
    // If joi validation violated, renders error page stating 
    // validation issues 
    updateUserEngagement: {
      validate : {
        payload : ratingSchema,
        options : { abortEarly : false},
        failAction : function (request, h, error) {
            return h.view("error-view", {title: " update rating error, please try again", errors: error.details }).takeover().code(400)
            },
        },
      handler: async function (request,h) {
        const rating = await db.ratingStore.getRatingById(request.params.id);
        const date = new Date();
            const newDetails = {
                comment : request.payload.comment,
                rating : request.payload.rating,
                ratingIconAddress : storeUtils.getRatingIcon(request.payload.rating),
                date : date.toISOString().replace("T", " ").replace("Z", " "),
                
            }
            await db.ratingStore.updateRating(rating, newDetails);
            return h.redirect("/engagement")
        }

      },
    }


