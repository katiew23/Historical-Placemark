import Mongoose from "mongoose";
import { Placemark } from "./placemark.js";

export const placemarkMongoStore = {
  
  async getAllPlacemarks() {
    
    try {
      
      return await Placemark.find().lean();
      
    } catch (err) {
      
      console.log("GET ALL PLACEMARKS ERROR:", err);
      
      return [];
    }
  },
  
  async addPlacemark(collectionId, placemark) {
    
    try {
      
      const newPlacemark = new Placemark({
        ...placemark,
        collectionid: collectionId
      });
      
      const placemarkObj = await newPlacemark.save();
      
      console.log("PLACEMARK CREATED:", placemarkObj);
      
      return this.getPlacemarkById(placemarkObj._id);
      
    } catch (err) {
      
      console.log("ADD PLACEMARK ERROR:", err);
      
      return null;
    }
  },
  
  async getPlacemarkById(id) {
    
    try {
      
      if (Mongoose.isValidObjectId(id)) {
        
        const placemark =
        await Placemark.findOne({ _id: id }).lean();
        
        console.log("FOUND PLACEMARK:", placemark);
        
        return placemark;
      }
      
      return null;
      
    } catch (err) {
      
      console.log("GET PLACEMARK ERROR:", err);
      
      return null;
    }
  },
  
  async deletePlacemark(id) {
    
    try {
      
      await Placemark.deleteOne({ _id: id });
      
      console.log("PLACEMARK DELETED:", id);
      
    } catch (err) {
      
      console.log("DELETE PLACEMARK ERROR:", err);
    }
  },
  
  async deletePlacemarkById(id) {
    
    return this.deletePlacemark(id);
  },
  
  async getPlacemarksByCollectionId(id) {
    
    try {
      
      return await Placemark.find({
        collectionid: id
      }).lean();
      
    } catch (err) {
      
      console.log("GET COLLECTION PLACEMARKS ERROR:", err);
      
      return [];
    }
  },
  
  async deleteAllPlacemarks() {
    
    try {
      
      await Placemark.deleteMany({});
      
      console.log("ALL PLACEMARKS DELETED");
      
    } catch (err) {
      
      console.log("DELETE ALL PLACEMARKS ERROR:", err);
    }
  },
  
  async updatePlacemark(id, updatedPlacemark) {
    
    try {
      
      const placemarkDoc = await Placemark.findById(id);
      
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
        placemarkDoc.yearEstablished =
        updatedPlacemark.yearEstablished;
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
      
      return placemarkDoc;
      
    } catch (err) {
      
      console.log("UPDATE PLACEMARK ERROR:", err);
      
      return null;
    }
  },
  
  async addReview(id, review) {
    
    try {
      
      console.log("ADDING REVIEW:", review);
      
      const placemark = await Placemark.findById(id);
      
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
        
        userid: review.userid || review._id
      });
      
      placemark.markModified("reviews");
      
      console.log("REVIEWS AFTER PUSH:", placemark.reviews);
      
      await placemark.save();
      
      console.log("REVIEW SAVED SUCCESSFULLY");
      
      return await Placemark.findById(id).lean();
      
    } catch (err) {
      
      console.log("ADD REVIEW ERROR:", err);
      
      return null;
    }
  },
  
  async deleteReview(placemarkId, reviewIndex) {
    
    try {
      
      console.log(
        "DELETE REVIEW:",
        placemarkId,
        reviewIndex
      );
      
      const placemark =
      await Placemark.findById(placemarkId);
      
      if (!placemark) {
        
        console.log("PLACEMARK NOT FOUND");
        
        return null;
      }
      
      placemark.reviews.splice(Number(reviewIndex), 1);
      
      placemark.markModified("reviews");
      
      await placemark.save();
      
      console.log("REVIEW DELETED");
      
      return await Placemark.findById(placemarkId).lean();
      
    } catch (err) {
      
      console.log("DELETE REVIEW ERROR:", err);
      
      return null;
    }
  },
  
  async updateReview(
    placemarkId,
    reviewIndex,
    updatedReview
  ) {
    
    try {
      
      console.log(
        "UPDATE REVIEW:",
        placemarkId,
        reviewIndex,
        updatedReview
      );
      
      const placemark =
      await Placemark.findById(placemarkId);
      
      if (!placemark) {
        
        console.log("PLACEMARK NOT FOUND");
        
        return null;
      }
      
      placemark.reviews[Number(reviewIndex)].name =
      updatedReview.name;
      
      placemark.reviews[Number(reviewIndex)].text =
      updatedReview.text;
      
      placemark.reviews[Number(reviewIndex)].rating =
      Number(updatedReview.rating);
      
      placemark.markModified("reviews");
      
      await placemark.save();
      
      console.log("REVIEW UPDATED");
      
      return await Placemark.findById(placemarkId).lean();
      
    } catch (err) {
      
      console.log("UPDATE REVIEW ERROR:", err);
      
      return null;
    }
  }
};