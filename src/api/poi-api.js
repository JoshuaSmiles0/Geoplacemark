import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { poiArray, poiSpec, poiSpecPlus, IdSpec, UserArray } from "../models/api-joi-schemas.js";
import { validationError } from "./logger.js";

/**
 * Poi api object. All protected by
 * JWT auth strategy to prevent access via
 * api routes to unauthorised users. All
 * annotated for hapi swagger documentation
 */
export const poiApi = {
     
        /**
          * Create Poi Api route. attempts to
          * create a user from http request payload
          * if successful returns success code and
          * new poi object. If not created returns
          * error. If cannot access server returns 
          * error
          */
        create: {
          auth: {
            strategy: "jwt",
          },
                handler: async function(request, h) {
                  try {
                    const poi = await db.poiStore.addPoi(request.payload);
                    if (poi) {
                      return h.response(poi).code(201);
                    }
                    return Boom.badImplementation("error creating poi");
                  } catch (err) {
                    return Boom.serverUnavailable("Database Error");
                  }
                },
                tags: ["api"],
                description: "Create a single poi",
                notes: "Creates one poi in the database from passed poi details",
                validate: {payload: poiSpec, failAction : validationError },
                response: {schema: poiSpecPlus, failAction: validationError},
              },
        
          /**
           * Return all poi api method. attempts to 
           * access and return a list of all pois from 
           * db. If error encountered, error message returned
           * with boom
           */
          findAll: {
            auth: {
              strategy: "jwt",
            },
            handler: async function(request, h) {
              try {
                const pois = await db.poiStore.getAllPoi();
                return pois;
              } catch (err) {
                return Boom.serverUnavailable("Database Error");
              }
            },
            tags: ["api"],
            description: "Get all poi",
            notes: "returns all pois from database",
            response: {schema: poiArray, failAction: validationError}
          },
    
          /**
           * attempts to retrieve poi by id from database using
           * passed id parameter from request. If no poi found
           * error message returned. If error encountered
           * error message returned using hapi boom
           */
          findById: {
            auth: {
              strategy: "jwt",
            },
            handler: async function (request, h) {
              try {
                const poi = await db.poiStore.getPoiById(request.params.id);
                if (!poi) {
                  return Boom.notFound("No Poi with this id");
                }
                return poi;
              } catch (err) {
                return Boom.serverUnavailable("No Poi with this id");
              }
            },
            tags: ["api"],
            description: "Find a poi by id",
            notes: "Retrieves poi associated with passed id",
            validate : {params : {id : IdSpec}, failAction: validationError},
            response : {schema : poiSpecPlus, failAction: validationError}
          },

          /**
           * Attempts to retrieve pois by userid from db using passed
           * userid parameter. If no users returned, error code returned.
           * If error encountered, error message returned. 
           */
          findByuserId: {
            auth: {
              strategy: "jwt",
            },
            handler: async function (request, h) {
              try {
                const poi = await db.poiStore.getPoiByUserId(request.params.userid);
                if(!poi)
                {
                    return Boom.notFound("No Poi with this user id");
                }
                return poi;
              } catch (err) {
                return Boom.serverUnavailable("No Poi associated with this user");
              }
            },
            tags: ["api"],
            description: "Find pois by user id",
            notes: "Retrieves all pois associated with passed userid",
            validate : {params : {userid: IdSpec}, failAction : validationError},
            response : {schema : poiArray, failAction : validationError},
          },

          /**
           * attempts to retrieve pois by type from db using passed type
           * parameter. If no data retrieved, error message returned
           * if error encountered, error message returned
           */
          findByType: {
            auth: {
              strategy: "jwt",
            },
            handler: async function (request, h) {
              try {
                const poi = await db.poiStore.getPoiByType(request.params.type);
                if (!poi) {
                  return Boom.notFound("no poi of this type");
                }
                return poi;
              } catch (err) {
                return Boom.serverUnavailable("no poi of this type");
              }
            },
            tags: ["api"],
            description: "Find Pois by type",
            notes: "Retrieves all pois of passed type",
            validate : {params :{ type : IdSpec}, failAction : validationError},
            response : {schema : poiArray, failAction : validationError},
          },
        
          /**
           * Attempts to remove all poi from db. if successful, returns success
           * code. If error encountered , error message returned
           */
          deleteAll: {
            auth: {
              strategy: "jwt",
            },
            handler: async function (request, h) {
              try {
                await db.poiStore.deleteAllPoi();
                return h.response().code(204);
              } catch (err) {
                return Boom.serverUnavailable("Database Error");
              }
            },
           tags: ["api"],
           description: "Delete all pois",
           notes: "Deletes all pois from database",
          },

          /**
           * Attempts to remove a poi from the database using passed 
           * id parameter. First attempts to locate poi by id. If
           * not found, error printed to user. Attempts to then 
           * remove from database. If successful, returns success code
           * if error encountered, error message returned
           */
          deleteById: {
            auth: {
              strategy: "jwt",
            },
            handler: async function (request, h) {
              try {
               const  poi = await db.poiStore.getPoiById(request.params.id);
                if (!poi) {
                    return Boom.notFound("No Poi found");
                }
                await db.poiStore.deletePoiById(poi._id);
                return h.response().code(204);
              } catch (err) {
                return Boom.serverUnavailable("Database Error");
              }
            },
            tags: ["api"],
            description: "Delete poi by id",
            notes: "Deletes a single poi using passed id",
            validate : {params : {id : IdSpec}, failAction : validationError},
          },

          /**
           * Method removes poi documents from db where userid matches passed 
           * userid parameter. Attempts to first locate documents. If none found
           * error message returned. If successful, returns success code. If
           * error encountered, error message returned.
           */
          deleteByUserId: {
            auth: {
              strategy: "jwt",
            },
            handler: async function (request, h) {
              try {
               const  poi = await db.poiStore.getPoiByUserId(request.params.userid);
                if (!poi) {
                    return Boom.notFound("No Pois found");
                }
                await db.poiStore.deletePoiByUserId(request.params.userid);
                return h.response().code(204);
              } catch (err) {
                return Boom.serverUnavailable("Database Error");
              }
            },
            tags: ["api"],
            description: "Delete pois by user id",
            notes: "Deletes all pois associated with passed userid",
            validate : {params : {userid : IdSpec}, failAction : validationError}
          },
          
          /**
           * Attempts to update a poi by id. First checks poi exists. If
           * doesnt exist, error message returned, else poi object returned
           * attempts to update poi using returned poi object and passed update
           * details payload. If successful, returns success code. If error 
           * encountered, returns error.
           */
          update: {
            auth: {
              strategy: "jwt",
            },
                  handler : async function (request, h) {
                      try {
                          const poi = await db.poiStore.getPoiById(request.params.id)
                          if (!poi)
                          {
                              return Boom.notFound("No User found");
                          }
                          await db.poiStore.updatePoi(poi, request.payload);
                          return h.response().code(204);
                      }
                      catch (err) {
                          return Boom.serverUnavailable("Database Error");
                      }
                  },
                  tags: ["api"],
                  description: "Update one poi",
                  notes: "Updates poi associated with passed id with passed update details",
                  validate: {params: {id: IdSpec}, payload: poiSpec, failAction: validationError},
                },
          };

        