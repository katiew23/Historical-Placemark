export const aboutController = {
  index: { handler: function (request, h) {
      const viewData = {
        title: "About Hisorical Placemark",
      };
      return h.view("about-view", viewData);
    },
  },
};

// Controllers contain the logic for each endpoint or page
// they read the request (params, payload, logged in user)
// they call the store/database through db store methods
// they return the response (data or error) back to the client

// controllers are the central place where requests are handled