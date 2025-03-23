import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { poiArray, poiSpec, poiSpecPlus, IdSpec, UserArray } from "../models/api-joi-schemas.js";
import { validationError } from "./logger.js";


export const poiApi = {

     create: {
            auth: false,
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
            validate: {payload: poiSpecPlus, failAction : validationError },
            response: {schema: poiSpecPlus, failAction: validationError},
          },
        
          findAll: {
            auth: false,
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
    
    
          findById: {
            auth: false,
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

          findByuserId: {
            auth: false,
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

          findByType: {
            auth: false,
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
        
    
          deleteAll: {
            auth: false,
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
    
          deleteById: {
            auth: false,
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

          deleteByUserId: {
            auth: false,
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
    
          update: {
                  auth: false,
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
                }
          };

        