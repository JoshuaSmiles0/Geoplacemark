import Boom from "@hapi/boom";
import { db } from "../models/db.js";


export const ratingApi = {

    create: {
                auth: false,
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
              },
            
              findAll: {
                auth: false,
                handler: async function(request, h) {
                  try {
                    const ratings = await db.ratingStore.getAllRatings();
                    return ratings;
                  } catch (err) {
                    return Boom.serverUnavailable("Database Error");
                  }
                },
              },
        
        
              findById: {
                auth: false,
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
              },
    
              findByuserId: {
                auth: false,
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
              },
    
              findByRating: {
                auth: false,
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
              },

              findByPoi: {
                auth: false,
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
              },
        
              deleteAll: {
                auth: false,
                handler: async function (request, h) {
                  try {
                    await db.ratingStore.deleteAllRatings();
                    return h.response().code(204);
                  } catch (err) {
                    return Boom.serverUnavailable("Database Error");
                  }
                },
              },
        
              deleteById: {
                auth: false,
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
              },
    
              deleteByUserId: {
                auth: false,
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
              },

              deleteByPoi: {
                auth: false,
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
              },
        
              update: {
                      auth: false,
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
                      }
                    }
};