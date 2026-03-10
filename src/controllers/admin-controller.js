import { db } from "../models/db.js";

export const adminController = {

  index: {
    handler: async function (request, h) {

      const loggedInUser = request.auth.credentials;

      if (loggedInUser.role !== "admin") {
        return h.redirect("/dashboard");
      }

      const users = await db.userStore.getAllUsers();
      const collections = await db.collectionStore.getAllCollections();
      const placemarks = await db.placemarkStore.getAllPlacemarks();

      const viewData = {
        title: "Admin Dashboard",
        users: users,
        userCount: users.length,
        collectionCount: collections.length,
        placemarkCount: placemarks.length
      };

      return h.view("admin-dashboard-view", viewData);
    }
  }

};