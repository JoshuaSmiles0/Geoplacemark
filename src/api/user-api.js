import Boom  from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, userSpec, userSpecPlus, UserArray, JwtAuth, userLoginSpec } from "../models/api-joi-schemas.js";
import { validationError } from "./logger.js";
import { createToken } from "./jwt-utils.js";

/**
 * user api object. Routes not protected by 
 * jwt.
 */
export const userApi = {
  
  /**
   * Api authentication method. Attempts to retrieve
   * user by passed email. If unsuccessful, returns error.
   * if successful, checks user password against passed password
   * parameter. If unsuccessful, passes error. If successful creates
   * api token with user details and returns this. If error encountered
   * in token creation, error message returned.
   */
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

    /**
     * Attempts to create a user document in db using passed user payload.
     * if successful, user object and success code returned, else returns 
     * error. If error encountered, error returned
     */
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

      /**
       * Attempts to retrieve all user documents from db. If successful
       * returns user array, if error encountered, error returned
       */
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

      /**
       * Attempts to retrieve one user using passed id parameter. If
       * user not found, returns error. If error encountered, error
       * returned
       */
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

      /**
       * Attempts to delete all user documents in db. If successful, success
       * code returned. If error encountered, error returned.
       */
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

      /**
       * Attempts to delete a user document by passed id param. First 
       * Attempts to retrieve user from db. If unsuccessful, returns error.
       * If successful, returns success code. If error encountered, error
       * returned
       */
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

      /**
       * Attempts to update one user in db. First attempts to retrieve 
       * user from db using passed id parameter. If unsuccessful, returns error
       * if successful, attempts to update user document using retrieved user 
       * and passed update details payload. If successful, returns success code
       * if error encountered, error returned
       */
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