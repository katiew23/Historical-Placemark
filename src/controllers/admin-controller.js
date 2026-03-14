import { db } from "../models/db.js";

export const adminController = {

  index: {
    handler: async function (request, h) {

      const loggedInUser = request.auth.credentials;

      console.log("ADMIN PAGE ROLE:", loggedInUser.role);

      if (loggedInUser.role !== "admin") {
        return h.redirect("/dashboard");
      }  // check if user is admin or not

      const users = await db.userStore.getAllUsers();
      const collections = await db.collectionStore.getAllCollections();
      const placemarks = await db.placemarkStore.getAllPlacemarks(); // this is for analytics

      const viewData = {
        title: "Admin Dashboard",
        users: users,
        userCount: users.length,
        collectionCount: collections.length,
        placemarkCount: placemarks.length,
        user: loggedInUser      
      };

      return h.view("admin-dashboard-view", viewData); // renders the page
    }
  },
  deleteUser: {
  handler: async function (request, h) {

    const loggedInUser = request.auth.credentials;

    if (loggedInUser.role !== "admin") {
      return h.redirect("/dashboard");
    }

    const userId = request.params.id;

    await db.userStore.deleteUserById(userId);

    return h.redirect("/admin");
  }
}
};

// added an admin button and created an admin user in `db.json`. When the admin account logs in, the button becomes visible so admin-specific functionality can be accessed.
