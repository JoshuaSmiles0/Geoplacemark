import { db } from "../models/db.js";

export const publicDashboardController = {

    index : {
        handler: async function (request, h) {
            const pois = await db.poiStore.getAllPoi();
            const viewData = {
                title: "Public Dashboard",
                pois: pois,
            }
            return h.view("public-dashboard-view", viewData)
        }
    },

    filterPublicPois : {
        handler: async function (request, h) {
            const publicPoisType = await db.poiStore.getPoiByType(request.payload.type);
            const viewData = {
                title: "Public Dashboard",
                pois: publicPoisType,
            }
            return h.view("public-dashboard-view", viewData)
        }
    },
};
