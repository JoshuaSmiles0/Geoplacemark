import { db } from "../models/db.js";
import { userSchema, userLoginSchema } from "../models/joi-schemas.js";

export const accountsController = {


      showSignup: {
        auth: false,
        handler: function (request, h) {
          return h.view("signup-view", { title: "Sign up to discover new geo-sites!" });
        },
      },

      showLogin: {
        auth: false,
        handler: function (request, h) {
          return h.view("login-view", { title: "Login to access your discoveries!" });
        },
      },

      async validate(request, session) {
        const user = await db.userStore.getUserById(session.id);
        if (!user) {
          return { isValid: false };
        }
        return { isValid: true, credentials: user };
      },

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
            return h.redirect("/")
          }
          request.cookieAuth.set({id: user._id});
          return h.redirect("/dashboard");
        }
      },

      logout: {
        auth: false,
        handler: async function (request, h){
          request.cookieAuth.clear();
          return h.redirect("/");
        }
      },

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
      }
}