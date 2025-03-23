import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { ratingArray, ratingSpec, ratingSpecPlus, IdSpec, userSpecPlus, } from "../models/api-joi-schemas.js";
import { validationError } from "./logger.js";


export const ratingApi = {

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
        validate : {payload : ratingSpecPlus, params : {poiid : IdSpec, userid : IdSpec}, failAction : validationError},
        response : {schema : ratingSpecPlus, failAction : validationError}
              },
            
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
                          }
                          catch (err) {
                              return Boom.serverUnavailable("Database Error");
                          }
                      },
                      tags: ["api"],
        description: "Update one rating",
        notes: "Updates rating associated with passed id with passed details",
        validate : {params : {id : IdSpec}, failAction : validationError},
                    }
};