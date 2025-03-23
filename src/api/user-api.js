import Boom  from "@hapi/boom";
import { db } from "../models/db.js";

export const userApi = {

    create: {
        auth: false,
        handler: async function(request, h) {
          try {
            const user = await db.userStore.addUser(request.payload);
            if (user) {
              return h.response(user).code(201);
            }
            return Boom.badImplementation("error creating user");
          } catch (err) {
            return Boom.serverUnavailable("Database Error");
          }
        },
      },
    
      findAll: {
        auth: false,
        handler: async function(request, h) {
          try {
            const users = await db.userStore.getAllUsers();
            return users;
          } catch (err) {
            return Boom.serverUnavailable("Database Error");
          }
        },
      },


      findById: {
        auth: false,
        handler: async function (request, h) {
          try {
            const user = await db.userStore.getUserById(request.params.id);
            if (!user) {
              return Boom.notFound("No User with this id");
            }
            return user;
          } catch (err) {
            return Boom.serverUnavailable("No User with this id");
          }
        },
      },

      deleteAll: {
        auth: false,
        handler: async function (request, h) {
          try {
            await db.userStore.deleteAllUsers();
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
           const  user = await db.userStore.getUserById(request.params.id);
            if (!user) {
                return Boom.notFound("No User found");
            }
            await db.userStore.deleteUserById(user._id);
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
                const user = await db.userStore.getUserById(request.params.id)
                if (!user)
                {
                    return Boom.notFound("No User found");
                }
                await db.userStore.updateUserDetails(user, request.payload);
                return h.response().code(204);
            }
            catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        }
      }
    };