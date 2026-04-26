import Mongoose from "mongoose";
import { Placemark } from "./placemark.js";

export const placemarkMongoStore = {

  async getAllPlacemarks() {
    return await Placemark.find().lean();
  },

  async addPlacemark(collectionId, placemark) {
    const newPlacemark = new Placemark({
      ...placemark,
      collectionid: collectionId
    });

    const placemarkObj = await newPlacemark.save();
    return this.getPlacemarkById(placemarkObj._id);
  },

  async getPlacemarkById(id) {
    if (Mongoose.isValidObjectId(id)) {
      return await Placemark.findOne({ _id: id }).lean();
    }
    return null;
  },

async deletePlacemark(id) {
  await Placemark.deleteOne({ _id: id });
},

async deletePlacemarkById(id) {
  return this.deletePlacemark(id);
},

  async getPlacemarksByCollectionId(id) {
    return await Placemark.find({ collectionid: id }).lean();
  },

 

  async deleteAllPlacemarks() {
    await Placemark.deleteMany({});
  },

  async updatePlacemark(id, updatedPlacemark) {
    const placemarkDoc = await Placemark.findById(id);

    if (!placemarkDoc) {
      console.log(`Placemark with id ${id} not found`);
      return null;
    }

    placemarkDoc.name = updatedPlacemark.name;
    placemarkDoc.description = updatedPlacemark.description;
    placemarkDoc.latitude = updatedPlacemark.latitude;
    placemarkDoc.longitude = updatedPlacemark.longitude;
    placemarkDoc.category = updatedPlacemark.category;
    placemarkDoc.yearEstablished = updatedPlacemark.yearEstablished;
    placemarkDoc.county = updatedPlacemark.county;

    await placemarkDoc.save();
  },
};