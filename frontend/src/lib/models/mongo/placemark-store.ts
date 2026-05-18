import mongoose from "mongoose";
import { PlacemarkMongoose, type Placemark, type Review } from "./placemark";

export const placemarkMongoStore = {
  async getAllPlacemarks(): Promise<Placemark[]> {
    try {
      return await PlacemarkMongoose.find().lean();
    } catch (err) {
      console.log("GET ALL PLACEMARKS ERROR:", err);
      return [];
    }
  },

  async addPlacemark(collectionId: string, placemark: Placemark): Promise<Placemark | null> {
    try {
      const newPlacemark = new PlacemarkMongoose({
        ...placemark,
        collectionid: collectionId
      });

      const placemarkObj = await newPlacemark.save();

      console.log("PLACEMARK CREATED:", placemarkObj);

      return this.getPlacemarkById(placemarkObj._id.toString());
    } catch (err) {
      console.log("ADD PLACEMARK ERROR:", err);
      return null;
    }
  },

  async getPlacemarkById(id: string): Promise<Placemark | null> {
    try {
      if (mongoose.isValidObjectId(id)) {
        const placemark = await PlacemarkMongoose.findOne({ _id: id }).lean();

        console.log("FOUND PLACEMARK:", placemark);

        return placemark;
      }

      return null;
    } catch (err) {
      console.log("GET PLACEMARK ERROR:", err);
      return null;
    }
  },

  async deletePlacemark(id: string): Promise<void> {
    try {
      await PlacemarkMongoose.deleteOne({ _id: id });

      console.log("PLACEMARK DELETED:", id);
    } catch (err) {
      console.log("DELETE PLACEMARK ERROR:", err);
    }
  },

  async deletePlacemarkById(id: string): Promise<void> {
    return this.deletePlacemark(id);
  },

  async getPlacemarksByCollectionId(id: string): Promise<Placemark[]> {
    try {
      return await PlacemarkMongoose.find({
        collectionid: id
      }).lean();
    } catch (err) {
      console.log("GET COLLECTION PLACEMARKS ERROR:", err);
      return [];
    }
  },

  async deleteAllPlacemarks(): Promise<void> {
    try {
      await PlacemarkMongoose.deleteMany({});

      console.log("ALL PLACEMARKS DELETED");
    } catch (err) {
      console.log("DELETE ALL PLACEMARKS ERROR:", err);
    }
  },

  async updatePlacemark(id: string, updatedPlacemark: Partial<Placemark>): Promise<Placemark | null> {
    try {
      const placemarkDoc = await PlacemarkMongoose.findById(id);

      if (!placemarkDoc) {
        console.log(`Placemark with id ${id} not found`);
        return null;
      }

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

      if (updatedPlacemark.reviews !== undefined) {
        placemarkDoc.reviews = updatedPlacemark.reviews;
        placemarkDoc.markModified("reviews");
      }

      await placemarkDoc.save();

      console.log("PLACEMARK UPDATED:", placemarkDoc);

      return placemarkDoc.toObject();
    } catch (err) {
      console.log("UPDATE PLACEMARK ERROR:", err);
      return null;
    }
  },

  async addReview(id: string, review: Review): Promise<Placemark | null> {
    try {
      console.log("ADDING REVIEW:", review);

      const placemark = await PlacemarkMongoose.findById(id);

      if (!placemark) {
        console.log("PLACEMARK NOT FOUND FOR REVIEW");
        return null;
      }

      if (!placemark.reviews) {
        placemark.reviews = [];
      }

      placemark.reviews.push({
        name: review.name,
        text: review.text,
        rating: Number(review.rating),
        userid: review.userid
      });

      placemark.markModified("reviews");

      console.log("REVIEWS AFTER PUSH:", placemark.reviews);

      await placemark.save();

      console.log("REVIEW SAVED SUCCESSFULLY");

      return await PlacemarkMongoose.findById(id).lean();
    } catch (err) {
      console.log("ADD REVIEW ERROR:", err);
      return null;
    }
  },

  async deleteReview(placemarkId: string, reviewIndex: string | number): Promise<Placemark | null> {
    try {
      console.log("DELETE REVIEW:", placemarkId, reviewIndex);

      const placemark = await PlacemarkMongoose.findById(placemarkId);

      if (!placemark) {
        console.log("PLACEMARK NOT FOUND");
        return null;
      }

      placemark.reviews?.splice(Number(reviewIndex), 1);

      placemark.markModified("reviews");

      await placemark.save();

      console.log("REVIEW DELETED");

      return await PlacemarkMongoose.findById(placemarkId).lean();
    } catch (err) {
      console.log("DELETE REVIEW ERROR:", err);
      return null;
    }
  },

  async updateReview(
    placemarkId: string,
    reviewIndex: string | number,
    updatedReview: Review
  ): Promise<Placemark | null> {
    try {
      console.log("UPDATE REVIEW:", placemarkId, reviewIndex, updatedReview);

      const placemark = await PlacemarkMongoose.findById(placemarkId);

      if (!placemark) {
        console.log("PLACEMARK NOT FOUND");
        return null;
      }

      if (!placemark.reviews) {
        placemark.reviews = [];
      }

      placemark.reviews[Number(reviewIndex)].name = updatedReview.name;
      placemark.reviews[Number(reviewIndex)].text = updatedReview.text;
      placemark.reviews[Number(reviewIndex)].rating = Number(updatedReview.rating);

      placemark.markModified("reviews");

      await placemark.save();

      console.log("REVIEW UPDATED");

      return await PlacemarkMongoose.findById(placemarkId).lean();
    } catch (err) {
      console.log("UPDATE REVIEW ERROR:", err);
      return null;
    }
  }
};