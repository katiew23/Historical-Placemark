import { userMongoStore } from "$lib/models/mongo/user-store";
import { collectionMongoStore } from "$lib/models/mongo/collection-store";
import { placemarkMongoStore } from "$lib/models/mongo/placemark-store";

export const adminService = {
  async getUsers() {
    const users = await userMongoStore.getAllUsers();
    return JSON.parse(JSON.stringify(users));
  },

  async getCollections() {
    const collections = await collectionMongoStore.getAllCollections();
    return JSON.parse(JSON.stringify(collections));
  },

  async getPlacemarks() {
    const placemarks = await placemarkMongoStore.getAllPlacemarks();
    return JSON.parse(JSON.stringify(placemarks));
  },

  async deleteUser(id: string) {
    await userMongoStore.deleteUserById(id);
    return true;
  },

  async deleteCollection(id: string) {
    await collectionMongoStore.deleteCollectionById(id);
    return true;
  },

  async deletePlacemark(id: string) {
    await placemarkMongoStore.deletePlacemarkById(id);
    return true;
  }
};