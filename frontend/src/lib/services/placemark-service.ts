import { placemarkMongoStore } from "$lib/models/mongo/placemark-store";
import type { Review } from "$lib/models/mongo/placemark";
import { imageStore } from "$lib/models/image-store";

export const placemarkService = {
  async getPlacemark(id: string) {
    const placemark = await placemarkMongoStore.getPlacemarkById(id);
    return JSON.parse(JSON.stringify(placemark));
  },
  
  async uploadImages(
    placemarkId: string,
    formData: FormData,
    userId: string
  ) {
    const placemark = await placemarkMongoStore.getPlacemarkById(placemarkId);
    
    if (!placemark) {
      return false;
    }
    
    const files = formData
    .getAll("imagefiles")
    .filter((file): file is File => file instanceof File && file.size > 0);
    
    if (!files.length) {
      return false;
    }
    
    const uploadedImages = [];
    
    for (const file of files) {
      const uploaded = await imageStore.uploadImage(file);
      uploadedImages.push(uploaded);
    }
    
    const existingImages = placemark.images || [];
    
    const newImageUrls = uploadedImages.map((image) => image.url);
    
    const reviewer = formData.get("reviewer") as string;
    const reviewText = formData.get("review") as string;
    const rating = Number(formData.get("rating"));
    
    const existingReviews = placemark.reviews || [];
    
    const newReviews = uploadedImages.map((image) => ({
      name: reviewer,
      text: reviewText,
      rating,
      userid: userId,
      image: image.url
    }));
    
    await placemarkMongoStore.updatePlacemark(placemarkId, {
      img: placemark.img || uploadedImages[0].url,
      imgId: placemark.imgId || uploadedImages[0].public_id,
      images: [...existingImages, ...newImageUrls],
      reviews: [...existingReviews, ...newReviews]
    });
    
    return true;
  },
  
  async saveReview(
    placemarkId: string,
    index: number,
    reviewData: Review
  ) {
    const updatedPlacemark = await placemarkMongoStore.updateReview(
      placemarkId,
      index,
      reviewData
    );
    
    return JSON.parse(JSON.stringify(updatedPlacemark));
  },
  
  async deleteReview(
    placemarkId: string,
    index: number
  ) {
    const updatedPlacemark = await placemarkMongoStore.deleteReview(
      placemarkId,
      index
    );
    
    return JSON.parse(JSON.stringify(updatedPlacemark));
  }
};