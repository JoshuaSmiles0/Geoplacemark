import { welcomeController } from "./controllers/welcome-controller.js";

export const webRoutes = [
    { method: "GET", path: "/", config: welcomeController.index }];