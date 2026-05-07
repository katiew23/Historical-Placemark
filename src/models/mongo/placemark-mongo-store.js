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

  // only update fields if they exist

  if (updatedPlacemark.name !== undefined) {
    placemarkDoc.name = updatedPlacemark.name;
  }

  if (updatedPlacemark.description !== undefined) {
    placemarkDoc.description = updatedPlacemark.description;
  }

  if (updatedPlacemark.latitude !== undefined) {
    placemarkDoc.latitude = updatedPlacemark.latitude;
  }

  if (updatedPlacemark.longitude !== undefined) {
    placemarkDoc.longitude = updatedPlacemark.longitude;
  }

  if (updatedPlacemark.category !== undefined) {
    placemarkDoc.category = updatedPlacemark.category;
  }

  if (updatedPlacemark.yearEstablished !== undefined) {
    placemarkDoc.yearEstablished = updatedPlacemark.yearEstablished;
  }

  if (updatedPlacemark.county !== undefined) {
    placemarkDoc.county = updatedPlacemark.county;
  }

  if (updatedPlacemark.img !== undefined) {
    placemarkDoc.img = updatedPlacemark.img;
  }

  if (updatedPlacemark.imgId !== undefined) {
    placemarkDoc.imgId = updatedPlacemark.imgId;
  }

  if (updatedPlacemark.images !== undefined) {
    placemarkDoc.images = updatedPlacemark.images;
  }

  await placemarkDoc.save();
},
async addReview(id, review) {

  const placemark = await Placemark.findById(id);

  if (!placemark) {
    return null;
  }

  placemark.reviews.push(review);

  await placemark.save();

  return placemark;
},

async deleteReview(placemarkId, reviewIndex) {

  const placemark = await Placemark.findById(placemarkId);

  if (!placemark) {
    return null;
  }

  placemark.reviews.splice(reviewIndex, 1);

  await placemark.save();

  return placemark;
},

async updateReview(placemarkId, reviewIndex, updatedReview) {

  const placemark = await Placemark.findById(placemarkId);

  if (!placemark) {
    return null;
  }

  placemark.reviews[reviewIndex] = updatedReview;

  await placemark.save();

  return placemark;
},
};