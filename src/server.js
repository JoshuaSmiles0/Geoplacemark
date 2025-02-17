import Hapi from "@hapi/hapi";
import path from "path";
import Vision from "@hapi/vision";
import Handlebars from "handlebars";
import { fileURLToPath } from "url";
import Joi from "joi";
import { webRoutes } from "./webRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function init() {
    const server = Hapi.server({
      port: 3000,
      host: "localhost",
    });
    await server.register(Vision);
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
    server.route(webRoutes);
    await server.start();
    console.log("Server running on %s", server.info.uri);
  }
process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();