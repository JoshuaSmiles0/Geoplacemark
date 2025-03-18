import Hapi from "@hapi/hapi";
import path from "path";
import Vision from "@hapi/vision";
import Handlebars from "handlebars";
import { fileURLToPath } from "url";
import Joi from "joi";
import Inert from "@hapi/inert";
import Cookie from "@hapi/cookie";
import dotenv from "dotenv";
import { webRoutes } from "./webRoutes.js";
import { db } from "./models/db.js";
import { accountsController } from "./controllers/accounts-controller.js";

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
    server.auth.strategy("session", "cookie", {
      cookie: {
        name: process.env.COOKIE_NAME,
        password: process.env.COOKIE_PASSWORD,
        isSecure: false,
      },
      redirectTo: "/",
      validate: accountsController.validate,
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
    db.init();
    server.route(webRoutes);
    await server.start();
    console.log("Server running on %s", server.info.uri);
  }
process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();