export const welcomeController = {

    index: {
      auth: false,
      handler: async function (request, h) {
        return h.view("welcome-view", {title:"Geoplacemark"});
      },
    }
}