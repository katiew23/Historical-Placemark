import mongoose from "mongoose";
import { CollectionMongoose, type Collection } from "./collection";
import { placemarkMongoStore } from "./placemark-store";

export const collectionMongoStore = {
  async getAllCollections(): Promise<Collection[]> {
    const collections = await CollectionMongoose.find().lean();

    for (const collection of collections) {
      collection.placemarks =
        (await placemarkMongoStore.getPlacemarksByCollectionId(collection._id.toString())) || [];
    }

    return collections;
  },

  async getCollectionById(id: string): Promise<Collection | null> {
    if (mongoose.isValidObjectId(id)) {
      const collection = await CollectionMongoose.findOne({ _id: id }).lean();

      if (collection) {
        collection.placemarks = await placemarkMongoStore.getPlacemarksByCollectionId(
          collection._id.toString()
        );
      }

      return collection;
    }

    return null;
  },

  async addCollection(collection: Collection): Promise<Collection> {
    console.log("COLLECTION SAVED:", collection);
    const newCollection = new CollectionMongoose(collection);
    const collectionObj = await newCollection.save();
    return collectionObj.toObject();
  },

  async getUserCollections(userid: string): Promise<Collection[]> {
    return await CollectionMongoose.find({ userid: userid }).lean();
  },

  async deleteCollectionById(id: string): Promise<void> {
    await CollectionMongoose.deleteOne({ _id: id });
  },

  async deleteAllCollections(): Promise<void> {
    await CollectionMongoose.deleteMany({});
  },

  async updateCollection(updatedCollection: Collection): Promise<void> {
    const collection = await CollectionMongoose.findOne({ _id: updatedCollection._id });

    if (collection) {
      collection.name = updatedCollection.name;
      collection.img = updatedCollection.img;
      await collection.save();
    }
  }
};