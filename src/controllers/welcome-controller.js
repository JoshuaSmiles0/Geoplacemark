export const welcomeController = {

  // renders landing page
    index: {
      auth: false,
      handler: async function (request, h) {
        return h.view("welcome-view", {title:"Geoplacemark"});
      },
    },

    // renders about page
    about: {
      auth: false,
      handler: async function (request, h) {
        return h.view("about-view", {title:"About Geoplacemark"})
      },
    },
}