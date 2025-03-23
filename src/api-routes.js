
import { userApi } from "./api/user-api.js";
import { poiApi } from "./api/poi-api.js";
import { ratingApi } from "./api/rating-api.js";



export const apiRoutes = [

   { method: "GET", path: "/api/users", config: userApi.findAll },
   { method: "POST", path: "/api/users", config: userApi.create },
   { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
   { method: "GET", path: "/api/users/{id}", config: userApi.findById},
   { method: "DELETE", path: "/api/users/{id}", config: userApi.deleteById},
   { method: "PUT", path: "/api/users/{id}", config: userApi.update},
   { method: "GET", path: "/api/pois", config: poiApi.findAll},
   { method: "POST", path: "/api/pois", config: poiApi.create},
   { method: "DELETE", path: "/api/pois", config: poiApi.deleteAll},
   { method: "GET", path: "/api/pois/{id}", config: poiApi.findById},
   { method: "GET", path: "/api/pois/user/{userid}", config: poiApi.findByuserId},
   { method: "GET", path: "/api/pois/type/{type}", config: poiApi.findByType},
   { method: "DELETE", path: "/api/pois/{id}", config: poiApi.deleteById},
   { method: "DELETE", path: "/api/pois/user/{userid}", config: poiApi.deleteByUserId},
   { method: "PUT", path: "/api/pois/{id}", config: poiApi.update},
   { method: "GET", path: "/api/ratings", config: ratingApi.findAll},
   { method: "POST", path: "/api/ratings/{poiid}/{userid}", config: ratingApi.create},
   { method: "DELETE", path: "/api/ratings", config: ratingApi.deleteAll},
   { method: "GET", path: "/api/ratings/{id}", config: ratingApi.findById},
   { method: "GET", path: "/api/ratings/user/{userid}", config: ratingApi.findByuserId},
   { method: "GET", path: "/api/ratings/poi/{poiid}", config: ratingApi.findByPoi},
   { method: "GET", path: "/api/ratings/rating/{rating}", config: ratingApi.findByRating},
   { method: "DELETE", path: "/api/ratings/{id}", config: ratingApi.deleteById},
   { method: "DELETE", path: "/api/ratings/user/{userid}", config: ratingApi.deleteByUserId},
   { method: "DELETE", path: "/api/ratings/poi/{poiid}", config: ratingApi.deleteByPoi},
   { method: "PUT", path: "/api/ratings/{id}", config: ratingApi.update},


];