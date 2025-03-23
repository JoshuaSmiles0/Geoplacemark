import { userApi } from "./api/user-api.js";


export const apiRoutes = [

   { method: "GET", path: "/api/users", config: userApi.findAll },
   { method: "POST", path: "/api/users", config: userApi.create },
   { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
   { method: "GET", path: "/api/users/{id}", config: userApi.findById},
   { method: "DELETE", path: "/api/users/{id}", config: userApi.deleteById},
   { method: "PUT", path: "/api/users/{id}", config: userApi.update},

];