import { db } from "../models/db.js";

// Controls public dashboard for users to interact with one anothers sites

export const publicDashboardController = {

    // Renders public dashboard listing all poi
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

    // Filters down public dashboard by type as in dashboard method
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
