import { welcomeController } from "./controllers/welcome-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { publicDashboardController } from "./controllers/public-dashboard-controller.js";
import { ratingController } from "./controllers/rating-controller.js";
import { adminController } from "./controllers/admin-controller.js";

// Web interface routes for geoplacemark website
export const webRoutes = [
    { method: "GET", path: "/", config: welcomeController.index },
    { method: "GET", path: "/about", config: welcomeController.about},
    { method: "GET", path: "/login", config: accountsController.showLogin },
    { method: "GET", path: "/signup", config: accountsController.showSignup },
    { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },
    { method: "POST", path: "/signUpUser", config: accountsController.signUp},
    { method: "POST", path: "/loginUser", config: accountsController.login},
    { method: "GET", path: "/dashboard", config: dashboardController.index},
    { method: "GET", path: "/logout", config: accountsController.logout},
    { method: "POST", path: "/dashboard/addPoi", config: dashboardController.addPoi},
    { method: "POST", path: "/dashboard/filtered", config: dashboardController.filterPois},
    { method: "GET", path: "/publicDashboard", config: publicDashboardController.index},
    { method: "POST", path: "/publicDashboard/filtered", config: publicDashboardController.filterPublicPois},
    { method: "GET", path: "/poi/{id}", config: ratingController.index},
    { method: "GET", path: "/publicPoi/{id}", config: ratingController.publicRatings},
    { method: "POST", path: "/publicPoi/{id}/addRating", config: ratingController.addRating },
    { method: "POST", path: "/poi/{id}/filtered", config: ratingController.filterRatings},
    { method: "POST", path: "/publicPoi/{id}/filtered", config: ratingController.filterPublicRatings},
    { method: "GET", path: "/poi/{poiId}/deleteRating/{ratingId}", config: ratingController.deleteRating},
    { method: "GET", path: "/poi/{id}/deletePoi", config: dashboardController.deletePoi},
    { method: "GET", path: "/settings", config: accountsController.showUpdateDetails},
    { method: "POST", path: "/updateUser/{id}", config: accountsController.updateUser},
    { method: "GET", path: "/deleteUser/{id}", config: accountsController.deleteUser},
    { method: "GET", path: "/poi/{id}/updatePoi", config: dashboardController.showUpdatePoi},
    { method: "POST", path: "/poi/{id}/commitPoiUpdate", config: dashboardController.updatePoi},
    { method: "GET", path: "/engagement", config: ratingController.showUserEngagement},
    { method: "GET", path: "/engagement/deleteRating/{id}", config: ratingController.deleteUserEngagement},
    { method: "GET", path: "/engagement/editRating/{id}", config: ratingController.showEditEngagement},
    { method: "POST", path: "/engagement/commitRatingEdit/{id}", config: ratingController.updateUserEngagement},
    { method: "GET", path: "/admin", config: adminController.showAdminLogin},
    { method: "POST", path: "/loginAdmin", config: adminController.adminLogin},
    { method: "GET", path: "/analytics", config: adminController.adminDashboard},
    { method: "GET", path: "/analytics/ratings", config: adminController.adminDashboardRatings},
    { method: "GET", path: "/analytics/sites", config: adminController.adminDashboardSites},
    { method: "GET", path: "/analytics/all", config: adminController.adminDashboardAll},
    { method: "GET", path: "/manageUsers", config: adminController.showManageUsers},
    { method: "GET", path: "/manageSites", config: adminController.showManageSites},
    { method: "GET", path: "/manageRatings", config: adminController.showManageRatings},
    { method: "GET", path: "/manageUsers/deleteUser/{id}", config: adminController.deleteUser},
    { method: "GET", path: "/manageSites/deleteSite/{id}", config: adminController.deleteSite},
    { method: "GET", path: "/manageRatings/deleteRating/{id}", config: adminController.deleteRating},
];