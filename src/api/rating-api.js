import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { ratingArray, ratingSpec, ratingSpecPlus, IdSpec, userSpecPlus, } from "../models/api-joi-schemas.js";
import { validationError } from "./logger.js";

/**
 * rating api object. All protected by
 * JWT auth strategy to prevent access via
 * api routes to unauthorised users. All
 * annotated for hapi swagger documentation
 */
export const ratingApi = {

  /**
   * Rating api creation method. Attempts to 
   * add a rating to the db using passed poiid and userid
   * parameters as well as an update payload. If successful
   * retunrs success code, if unsuccessful returns error 
   * If error encountered, returns error
   */
  create: {
  auth: {
  strategy: "jwt",
   },
  handler: async function(request, h) {
      try {
          const rating = await db.ratingStore.addRating(request.params.poiid, request.params.userid,request.payload);
          if (rating) {
            return h.response(rating).code(201);
          }
          return Boom.badImplementation("error creating rating");
          } catch (err) {
            return Boom.serverUnavailable("Database Error");
          }
        },
        tags: ["api"],
        description: "Create a single Rating",
        notes: "Creates one rating in the database from passed rating details",
        validate : {payload : ratingSpec, params : {poiid : IdSpec, userid : IdSpec}, failAction : validationError},
        response : {schema : ratingSpecPlus, failAction : validationError}
    },

        /**
         * Api method to retrieve all rating documents from db. Attempts
         * to retrieve and return. If error encountered, error returned
         */
        findAll: {
          auth: {
            strategy: "jwt",
          },
          handler: async function(request, h) {
            try {
              const ratings = await db.ratingStore.getAllRatings();
              return ratings;
            } catch (err) {
              return Boom.serverUnavailable("Database Error");
            }
          },
          tags: ["api"],
          description: "Get all ratings",
            notes: "retrieves all ratings from the database",
          response: {schema : ratingArray, failAction: validationError}
        },
  
        /**
         * Attempts to retrieve a rating document from db using passed id
         * parameter. If unsuccessful, returns error. If successful returns
         * rating document. if error encountered, returns error
         */
        findById: {
          auth: {
            strategy: "jwt",
          },
          handler: async function (request, h) {
            try {
              const rating = await db.ratingStore.getRatingById(request.params.id);
              if (!rating) {
                return Boom.notFound("No rating with this id");
              }
              return rating;
            } catch (err) {
              return Boom.serverUnavailable("No Rating with this id");
            }
          },
          tags: ["api"],
          description: "Find a rating by id",
          notes: "Retrieves rating from database corresponding to passed id",
          validate : {params : {id : IdSpec}, failAction : validationError},
          response : {schema : ratingSpecPlus, failAction : validationError},
        },

        /**
         * Attempts to retrieve rating documents from db using passed userid 
         * parameter. If successful, returns ratings. If unsuccessful, returns
         * error. If error encountered error returned.
         */
        findByuserId: {
          auth: {
            strategy: "jwt",
          },
          handler: async function (request, h) {
            try {
              const rating = await db.ratingStore.getRatingsByUserId(request.params.userid);
              if(!rating)
              {
                  return Boom.notFound("No ratings with this user id");
              }
              return rating;
            } catch (err) {
              return Boom.serverUnavailable("No ratings associated with this user");
            }
          },
          tags: ["api"],
              description: "Find ratings by user id",
            notes: "retrieves all ratings associated with passed userid",
            validate : {params : {userid : IdSpec}, failAction : validationError},
            response : {schema : ratingArray, failAction : validationError},
        },

        /**
         * Attempts to retrieve rating documents from db using passed rating 
         * parameter. If successful, returns ratings. If unsuccessful, returns
         * error. If error encountered error returned.
         */
        findByRating: {
          auth: {
            strategy: "jwt",
          },
          handler: async function (request, h) {
            try {
              const rating = await db.ratingStore.getRatingsByRatingValue(request.params.rating);
              if (!rating) {
                return Boom.notFound("no ratings of this value");
              }
              return rating;
            } catch (err) {
              return Boom.serverUnavailable("no ratings of this value");
            }
          },
          tags: ["api"],
          description: "Find ratings by rating value",
          notes: "retrieves all ratings of the passed value",
          validate : {params : {rating : IdSpec}, failAction : validationError},
          response : {schema : ratingArray, failAction : validationError},
        },
        
        /**
         * Attempts to retrieve rating documents from db using passed poiid 
         * parameter. If successful, returns ratings. If unsuccessful, returns
         * error. If error encountered error returned.
         */
        findByPoi: {
          auth: {
            strategy: "jwt",
          },
          handler: async function (request, h) {
            try {
              const rating = await db.ratingStore.getRatingsByPoiId(request.params.poiid);
              if (!rating) {
                return Boom.notFound("no ratings on this site");
              }
              return rating;
            } catch (err) {
              return Boom.serverUnavailable("no ratings on this site");
            }
          },
          tags: ["api"],
          description: "Find ratings by poi",
          notes: "retrieves all ratings associated with passed poi id",
          validate : {params : {poiid : IdSpec}, failAction : validationError},
          response : {schema : ratingArray, failAction : validationError},
        },

        /**
         * Attempts to delete all ratings from db. If successful
         * returns success code. If error encountered, returns
         * error
         */
        deleteAll: {
          auth: {
            strategy: "jwt",
          },
          handler: async function (request, h) {
            try {
              await db.ratingStore.deleteAllRatings();
              return h.response().code(204);
            } catch (err) {
              return Boom.serverUnavailable("Database Error");
            }
          },
          tags: ["api"],
            description: "Delete all ratings",
            notes: "deletes all ratings from the database",
        },

        /**
         * Attempts to delete a rating by passed id parameter. first
         * attempts to retrieve document. If unsuccessful, returns error
         * if successful, attempts to delete rating from db. If successful
         * returns success code. If error encountered, returns error
         */
        deleteById: {
          auth: {
            strategy: "jwt",
          },
          handler: async function (request, h) {
            try {
              const  rating = await db.ratingStore.getRatingById(request.params.id);
              if (!rating) {
                  return Boom.notFound("No rating found");
              }
              await db.ratingStore.deleteRatingById(rating._id);
              return h.response().code(204);
            } catch (err) {
              return Boom.serverUnavailable("Database Error");
            }
          },
          tags: ["api"],
          description: "Delete rating by id",
            notes: "deletes rating associated with passed id",
            validate : {params : {id : IdSpec}, failAction : validationError},
        },

        /**
         * Attempts to delete ratings by passed userid parameter. first
         * attempts to retrieve documents. If unsuccessful, returns error
         * if successful, attempts to delete ratings from db. If successful
         * returns success code. If error encountered, returns error
         */
        deleteByUserId: {
          auth: {
            strategy: "jwt",
          },
          handler: async function (request, h) {
            try {
              const  rating = await db.ratingStore.getRatingsByUserId(request.params.userid);
              if (!rating) {
                  return Boom.notFound("No ratings found");
              }
              await db.ratingStore.deleteRatingsByUserId(request.params.userid);
              return h.response().code(204);
            } catch (err) {
              return Boom.serverUnavailable("Database Error");
            }
          },
          tags: ["api"],
            description: "Delete ratings by user id",
              notes: "Delete all ratings associated with passed user id",
              validate : {params : {userid : IdSpec}, failAction : validationError},
        },

        /**
         * Attempts to delete ratings by passed id parameter. first
         * attempts to retrieve documents. If unsuccessful, returns error
         * if successful, attempts to delete ratings from db. If successful
         * returns success code. If error encountered, returns error
         */
        deleteByPoi: {
          auth: {
            strategy: "jwt",
          },
          handler: async function (request, h) {
            try {
              const  rating = await db.ratingStore.getRatingsByPoiId(request.params.poiid);
              if (!rating) {
                  return Boom.notFound("No ratings found");
              }
              await db.ratingStore.deleteRatingsByPoiId(request.params.poiid);
              return h.response().code(204);
            } catch (err) {
              return Boom.serverUnavailable("Database Error");
            }
          },
          tags: ["api"],
            description: "Delete ratings by poi id",
            notes: "Deletes all ratings associated with passed poi id",
            validate : {params : {poiid : IdSpec}, failAction : validationError},
        },
        
        /**
         * Attempts to update a rating in db. First checks if rating exists
         * by retrieval using passed id parameter. If not exists, returns 
         * error message. If exists, attempts to update document using retrieved
         * object and passed updated details payload. If successful, returns
         * success code. If error encountered, returns error message.
         */
        update: {
        auth: {
          strategy: "jwt",
        },
          handler : async function (request, h) {
            try {
              const rating = await db.ratingStore.getRatingById(request.params.id)
              if (!rating)
                {
                  return Boom.notFound("No User found");
                }
              await db.ratingStore.updateRating(rating, request.payload);
              return h.response().code(204);
                } catch (err) {
                      return Boom.serverUnavailable("Database Error");
                }
              },
              tags: ["api"],
              description: "Update one rating",
              notes: "Updates rating associated with passed id with passed details",
              validate : {params : {id : IdSpec}, failAction : validationError},
            },
};