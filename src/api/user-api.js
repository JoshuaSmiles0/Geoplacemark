import Boom  from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, userSpec, userSpecPlus, UserArray, JwtAuth, userLoginSpec } from "../models/api-joi-schemas.js";
import { validationError } from "./logger.js";
import { createToken } from "./jwt-utils.js";


export const userApi = {

  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserByEmail(request.payload.email);
        if (!user) {
          return Boom.unauthorized("User not found");
        }
        if (user.password !== request.payload.password) {
          return Boom.unauthorized("Invalid password");
        }
        const token = createToken(user);
        return h.response({ success: true, token: token }).code(201);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
        description: "authenticate a user",
        notes: "Authenticates user access into protected API methods",
        validate: { payload: userLoginSpec, failAction: validationError },
        response: { schema: JwtAuth, failAction: validationError }
  },

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
        tags: ["api"],
        description: "Create a single user",
        notes: "Creates one user in the database from passed user details",
        validate: { payload: userSpec, failAction: validationError },
        response: { schema: userSpecPlus, failAction: validationError },
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
        tags: ["api"],
        description: "Get all users",
        notes: "Returns details of all users",
        response: {schema: UserArray, failAction: validationError},
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
        tags: ["api"],
        description: "Get one user by id",
        notes: "Returns details of user with corresponding id",
        validate : {params: {id: IdSpec}, failAction: validationError},
        response: {schema: userSpecPlus, failAction:  validationError}
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
        tags: ["api"],
        description: "Delete all users",
        notes: "Deletes all users from db",
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
        tags: ["api"],
        description: "Delete one user by id",
        notes: "Deletes user in db with corresponding passed id",
        validate: {params: {id: IdSpec}, failAction : validationError}
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
        },
        tags: ["api"],
        description: "Update one user",
        notes: "Updates a user by id with passed update details",
        validate: {params: {id: IdSpec}, payload: userSpec, failAction: validationError},
      },
    };