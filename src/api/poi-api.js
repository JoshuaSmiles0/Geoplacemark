import Boom from "@hapi/boom";
import { db } from "../models/db.js";


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
                  }
                }
          };

    