import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { imageArray, imageSpec, imageSpecPlus, IdSpec } from "../models/api-joi-schemas.js";
import { validationError } from "./logger.js";
import { imageStore } from "../models/image-store.js"


export const imageApi = {
  
  
   findByPoiId: {
          auth: {
            strategy: "jwt",
          },
          handler: async function (request, h) {
            try {
              const rating = await db.imageStore.getImageByPoiId(request.params.poiid);
              if(!rating)
              {
                  return Boom.notFound("No images with this poi id");
              }
              return rating;
            } catch (err) {
              return Boom.serverUnavailable("No images associated with this poi");
            }
          },
          tags: ["api"],
              description: "Find images by poi id",
            notes: "retrieves all images associated with passed poiid",
            validate : {params : {poiid : IdSpec}, failAction : validationError},
            response : {schema : imageArray, failAction : validationError},
        },
  
  deleteById: {
            auth: {
              strategy: "jwt",
            },
            handler: async function (request, h) {
              try {
               const  image = await db.imageStore.getImageById(request.params.id);
                if (!image) {
                    return Boom.notFound("No Poi found");
                }
                await db.imageStore.deleteImageById(image._id);
                await imageStore.deleteImage(request.params.name)
                return h.response().code(204);
              } catch (err) {
                return Boom.serverUnavailable("Database Error");
              }
            },
            tags: ["api"],
            description: "Delete poi by id",
            notes: "Deletes a single poi using passed id",
            validate : {params : {id : IdSpec, name : IdSpec }, failAction : validationError},
          },
  
  
  
  
}