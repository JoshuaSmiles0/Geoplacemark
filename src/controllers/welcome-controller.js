export const welcomeController = {

    index: {
      handler: async function (request, h) {
        const viewData = {
          title: "Geoplacemark",
        };
        return h.view("welcome-view", viewData);
      },
    }
}