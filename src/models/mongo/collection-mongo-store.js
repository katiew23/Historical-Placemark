import Mongoose from "mongoose";
import { Collection } from "./collection.js";
import { placemarkMongoStore } from "./placemark-mongo-store.js";

export const collectionMongoStore = {

  async getAllCollections() {
    const collections = await Collection.find().lean();

    for (const collection of collections) {
      collection.placemarks =
        await placemarkMongoStore.getPlacemarksByCollectionId(collection._id) || [];
    }

    return collections;
  },

  async getCollectionById(id) {
    if (Mongoose.isValidObjectId(id)) {
      const collection = await Collection.findOne({ _id: id }).lean();
      if (collection) {
        collection.placemarks =
          await placemarkMongoStore.getPlacemarksByCollectionId(collection._id);
      }
      return collection;
    }
    return null;
  },

  async addCollection(collection) {
    console.log("COLLECTION SAVED:", collection);
    const newCollection = new Collection(collection);
    const collectionObj = await newCollection.save();
    return collectionObj.toObject();
  },

  async getUserCollections(id) {
    return await Collection.find({ userid: id }).lean();
  },

  async deleteCollectionById(id) {
    await Collection.deleteOne({ _id: id });
  },

  async deleteAllCollections() {
    await Collection.deleteMany({});
  },

  async updateCollection(updatedCollection) {
    const collection = await Collection.findOne({ _id: updatedCollection._id });
    collection.name = updatedCollection.name;
    collection.img = updatedCollection.img;
    await collection.save();
  }
};