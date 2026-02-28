export const aboutController = {
  index: {
    handler: function (request, h) {
      const viewData = {
        title: "About Hisorical Placemark",
      };
      return h.view("about-view", viewData);
    },
  },
};
