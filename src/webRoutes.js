import { welcomeController } from "./controllers/welcome-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { methodNotAllowed } from "@hapi/boom";

export const webRoutes = [
    { method: "GET", path: "/", config: welcomeController.index },
    { method: "GET", path: "/login", config: accountsController.showLogin },
    { method: "GET", path: "/signup", config: accountsController.showSignup },
    { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },
    { method: "POST", path: "/signUpUser", config: accountsController.signUp},
    { method: "POST", path: "/loginUser", config: accountsController.login},
    { method: "GET", path: "/dashboard", config: dashboardController.index},
    { method: "GET", path: "/logout", config: accountsController.logout},
    { method: "POST", path: "/dashboard/addPoi", config: dashboardController.addPoi},
];