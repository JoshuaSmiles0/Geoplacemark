import Hapi from "@hapi/hapi";
import path from "path";
import Vision from "@hapi/vision";
import Handlebars from "handlebars";
import { fileURLToPath } from "url";
import Joi from "joi";
import Inert from "@hapi/inert";
import Cookie from "@hapi/cookie";
import dotenv from "dotenv";
import HapiSwagger from "hapi-swagger";
import jwt from "hapi-auth-jwt2";
import { webRoutes } from "./webRoutes.js";
import { apiRoutes } from "./api-routes.js";
import { db } from "./models/db.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { validate } from "./api/jwt-utils.js";

const swaggerOptions = {
  info: {
    title: "Geoplacemark API",
    version: "0.1",
  },
  securityDefinitions: {
    jwt: {
      type: "apiKey",
      name: "Authorization",
      in: "header"
    }
  },
  security: [{ jwt: [] }]
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  process.exit(1);
}

async function init() {
    const server = Hapi.server({
      port: 3000,
      host: "localhost",
    });
    await server.register(Vision);
    await server.register(Cookie);
    await server.register(Inert);
    await server.register({
      plugin: HapiSwagger,
      options: swaggerOptions,
    },);
    await server.register(jwt);
    server.auth.strategy("session", "cookie", {
      cookie: {
        name: process.env.COOKIE_NAME,
        password: process.env.COOKIE_PASSWORD,
        isSecure: false,
      },
      redirectTo: "/",
      validate: accountsController.validate,
    });
    server.auth.strategy("jwt", "jwt", {
      key: process.env.cookie_password,
      validate: validate,
      verifyOptions: { algorithms: ["HS256"] }
    });
    server.auth.default("session");
    server.validator(Joi);
    server.views({
      engines: {
        hbs: Handlebars,
      },
      relativeTo: __dirname,
      path: "./views",
      layoutPath: "./views/layouts",
      partialsPath: "./views/partials",
      layout: true,
      isCached: false,
    });
    db.init("mongo");
    server.route(apiRoutes);
    server.route(webRoutes);
    await server.start();
    console.log("Server running on %s", server.info.uri);
  }
process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();