import { db } from "../models/db.js";
import { userSchema, userLoginSchema } from "../models/joi-schemas.js";

export const accountsController = {

      // Renders sign up view
      showSignup: {
        auth: false,
        handler: function (request, h) {
          return h.view("signup-view", { title: "Sign up to discover new geo-sites!" });
        },
      },

      // renders login view
      showLogin: {
        auth: false,
        handler: function (request, h) {
          return h.view("login-view", { title: "Login to access your discoveries!" });
        },
      },

      // validates user against session userid and returns credentials
      async validate(request, session) {
        const user = await db.userStore.getUserById(session.id);
        if (!user) {
          return { isValid: false };
        }
        return { isValid: true, credentials: user };
      },

      /**
       * Adds a user to datastore from passed payload
       * and redirects to index page. If Joi validation
       * violated, returns user to signup page with errors
       */
      signUp: {
        auth: false,
        validate : {
          payload : userSchema,
          options : { abortEarly : false},
          failAction : function (request, h, error) {
            return h.view("signup-view", {title: "signup error, please try again", errors: error.details }).takeover().code(400)
          },
        },
        handler: async function (request, h) {
          const user = request.payload;
          await db.userStore.addUser(user);
          return h.redirect("/");
        },
      },

      /**
       * Compares submitted credentials to database. 
       * If user doesnt exist or password incorrect redirects
       * user to login page and displays error. If Joi validation
       * violated, also redirected. If user passes, cookie set to 
       * user id and user dashboard rendered
       */
      login: {
        auth: false,
        validate : {
          payload : userLoginSchema,
          options : { abortEarly : false},
          failAction : function (request, h, error) {
            return h.view("login-view", {title: "login error, please try again", errors: error.details }).takeover().code(400)
          },
        },
        handler: async function (request, h){
          const { email, password } = request.payload;
          const user = await db.userStore.getUserByEmail(email);
          if (!user || user.password !== password){
            const viewData = {
              title : "Login to access your discoveries!",
              logInError : true,
            }
            return h.view("login-view", viewData)
          }
          request.cookieAuth.set({id: user._id});
          return h.redirect("/dashboard");
        }
      },

      /**
       * Clears cookies and redirects to index page
       * logging out
       */
      logout: {
        auth: false,
        handler: async function (request, h){
          request.cookieAuth.clear();
          return h.redirect("/");
        }
      },

      // Redirects user to update their account details, requires validation
      // to be passed and session cookie set
      showUpdateDetails: {
        handler: async function (request, h){
          const loggedInUser = request.auth.credentials;
          const user = await db.userStore.getUserById(loggedInUser._id);
          const viewData = {
            title: "Update User Details",
            user: user,
          }
          return h.view("settings-view", viewData);
        }
      },

      /**
       * Retrieves user from passed id param.
       * constructs new user details from payload
       * updates user using old and new details 
       * Also cascades and updates related Pois and Ratings
       * Logs user out
       */
      updateUser: {
        validate : {
              payload : userSchema,
              options : { abortEarly : false},
              failAction : function (request, h, error) {
                  return h.view("error-view", {title: "Update error, please try again", errors: error.details }).takeover().code(400)
                  },
                  },
        handler: async function (request, h){
          const user = await db.userStore.getUserById(request.params.id);
          const newDetails = {
            firstName: request.payload.firstName,
            surname: request.payload.surname,
            email: request.payload.email,
            password: request.payload.password,
          }
          await db.userStore.updateUserDetails(user, newDetails);
          const updatedUser = await db.userStore.getUserById(request.params.id);
          await db.poiStore.updatePoiUser(updatedUser);
          await db.ratingStore.updateRatingUser(updatedUser);
          request.cookieAuth.clear();
          return h.redirect("/login");
        }
      },

      // Retrieves user from passed id param. Deletes user
      // using this and associated Pois + ratings.
      // Redirects to index page 
      deleteUser: {
        handler: async function (request, h){
          const user = await db.userStore.getUserById(request.params.id);
          await db.userStore.deleteUserById(user._id);
          await db.poiStore.deletePoiByUserId(user._id);
          await db.ratingStore.deleteRatingsByUserId(user._id);
          return h.redirect("/")
        }
      }
};