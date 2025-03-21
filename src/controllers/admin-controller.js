import dotenv from "dotenv";
import { db } from "../models/db.js";
import { userLoginSchema } from "../models/joi-schemas.js";


export const adminController = {


    showAdminLogin: {
        auth: false,
        handler: function (request, h) {
          return h.view("admin-login-view", { title: "Login to manage Geoplacemark" });
        },
      },


      adminLogin: {
              auth: false,
              validate : {
                payload : userLoginSchema,
                options : { abortEarly : false},
                failAction : function (request, h, error) {
                  return h.view("error-view", {title: "login error, please try again", errors: error.details }).takeover().code(400)
                },
              },
              handler: async function (request, h){
                const { email, password } = request.payload;
                const user = await db.userStore.getUserByEmail(email); 
                if (email !== process.env.admin_email  || password !== process.env.admin_password){
                  const viewData = {
                    title : "Login to manage Geoplacemark",
                    logInError : true,
                  }
                  return h.view("admin-login-view", viewData)
                }
                request.cookieAuth.set({id: user._id});
                return h.redirect("/analytics");
              }
            },

            adminDashboard: {
                handler: async function (request, h) {
                    const viewData = {
                        title : "Geoplacemark Analytics Dashboard",
                        subtitle :"Please select metrics to view"
                    }
                    return h.view("admin-dashboard-view", viewData);
                }
            },

            adminDashboardRatings: {
                handler: async function (request, h) {
                    const ratings = await db.ratingStore.getAllRatings();
                    const ratingLabels = ["1","2","3","4","5"];
                    const ratingMetrics = [];
                    const oneStar = await db.ratingStore.getRatingsByRatingValue(ratingLabels[0])
                    ratingMetrics.push(oneStar.length)
                    const twoStar = await db.ratingStore.getRatingsByRatingValue(ratingLabels[1])
                    ratingMetrics.push(twoStar.length)
                    const threeStar = await db.ratingStore.getRatingsByRatingValue(ratingLabels[2])
                    ratingMetrics.push(threeStar.length)
                    const fourStar = await db.ratingStore.getRatingsByRatingValue(ratingLabels[3])
                    ratingMetrics.push(fourStar.length)
                    const fiveStar = await db.ratingStore.getRatingsByRatingValue(ratingLabels[4])
                    ratingMetrics.push(fiveStar.length)
                    const viewData = {
                        title : "Geoplacemark Analytics Dashboard",
                        subtitle :"Please select metrics to view",
                        graph : true,
                        dataName : "ratingDistribution",
                        graphName: "Total breakdown of ratings on Geoplacemark",
                        ratingLabels : ratingLabels,
                        ratingMetrics : ratingMetrics
                    }
                    return h.view("admin-dashboard-view", viewData);
                }
            },

            adminDashboardSites: {
                handler: async function (request, h) {
                    const ratingLabels = ["economic","mineralogical","palaeo"];
                    const ratingMetrics = [];
                    const economicSites = await db.poiStore.getPoiByType(ratingLabels[0])
                    ratingMetrics.push(economicSites.length)
                    const mineralSites = await db.poiStore.getPoiByType(ratingLabels[1])
                    ratingMetrics.push(mineralSites.length)
                    const palaeoSites = await db.poiStore.getPoiByType(ratingLabels[2])
                    ratingMetrics.push(palaeoSites.length)
                    const viewData = {
                        title : "Geoplacemark Analytics Dashboard",
                        subtitle :"Please select metrics to view",
                        graph : true,
                        dataName : "siteDistribution",
                        graphName: "Total breakdown of sites on Geoplacemark",
                        ratingLabels : ratingLabels,
                        ratingMetrics : ratingMetrics
                    }
                    return h.view("admin-dashboard-view", viewData);
                }
            },

            adminDashboardAll: {
                handler: async function (request, h) {
                    const ratings = await db.ratingStore.getAllRatings();
                    const pois = await db.poiStore.getAllPoi();
                    const users = await db.userStore.getAllUsers();
                    const ratingLabels = ["Users","Sites","Ratings"];
                    const ratingMetrics = [0,0,0];
                    ratingMetrics[0] = users.length -1;
                    ratingMetrics[1] = pois.length;
                    ratingMetrics[2] = ratings.length;
                    const viewData = {
                        title : "Geoplacemark Analytics Dashboard",
                        subtitle :"Please select metrics to view",
                        graph : true,
                        dataName : "allDistribution",
                        graphName: "Total metrics on Geoplacemark",
                        ratingLabels : ratingLabels,
                        ratingMetrics : ratingMetrics
                    }
                    return h.view("admin-dashboard-view", viewData);
                }
            },

            showManageUsers : {
                handler: async function (request, h){
                    const users = await db.userStore.getAllUsers()
                    const viewData = {
                        title: "Manage Geoplacemark Users",
                        users: users,
                        manageUsers : true,
                    }
                    return h.view("manage-site-view", viewData)
                }
            },

            showManageSites : {
                handler: async function (request, h){
                    const pois = await db.poiStore.getAllPoi()
                    const viewData = {
                        title: "Manage Geoplacemark Geosites",
                        pois: pois,
                        manageSites : true
                    }
                    return h.view("manage-site-view", viewData)
                }
            },

            showManageRatings : {
                handler: async function (request, h){
                    const ratings = await db.ratingStore.getAllRatings()
                    const viewData = {
                        title: "Manage Geoplacemark ratings",
                        ratings: ratings,
                        manageRatings: true
                    }
                    return h.view("manage-site-view", viewData)
                }
            },

            deleteUser: {
                handler: async function (request, h) {
                    const user = await db.userStore.getUserById(request.params.id);
                    await db.userStore.deleteUserById(user._id);
                    await db.poiStore.deletePoiByUserId(user._id);
                    await db.ratingStore.deleteRatingsByUserId(user._id);
                    return h.redirect("/manageUsers");
                }
            },

            deleteSite: {
                handler: async function (request, h) {
                    const poi = await db.poiStore.getPoiById(request.params.id);
                    await db.ratingStore.deleteRatingsByPoiId(poi._id);
                    await db.poiStore.deletePoiById(poi._id);
                    return h.redirect("/manageSites")
                }
            },

            deleteRating: {
                handler: async function (request, h) {
                    const rating = await db.ratingStore.getRatingById(request.params.id);
                    await db.ratingStore.deleteRatingById(rating._id);
                    return h.redirect("/manageRatings");
                }

            },
};