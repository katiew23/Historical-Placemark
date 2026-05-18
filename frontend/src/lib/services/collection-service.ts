import { collectionMongoStore } from "$lib/models/mongo/collection-store";
import { placemarkMongoStore } from "$lib/models/mongo/placemark-store";
import { imageStore } from "$lib/models/image-store";

export const collectionService = {
  async getCollection(id: string) {
    const collection = await collectionMongoStore.getCollectionById(id);
    return JSON.parse(JSON.stringify(collection));
  },
  
  async updateCollection(id: string, collectionData: any) {
    await collectionMongoStore.updateCollection({
      _id: id,
      ...collectionData
    });
    
    return true;
  },
  
  async getCollections() {
    const collections = await collectionMongoStore.getAllCollections();
    return JSON.parse(JSON.stringify(collections));
  },
  
  async addCollection(collectionData: any) {
    await collectionMongoStore.addCollection(collectionData);
    return true;
  },
  
  async deleteCollection(id: string) {
    await collectionMongoStore.deleteCollectionById(id);
    return true;
  },
  
  async addPlacemark(collectionId: string, formData: FormData) {
    const files = formData
    .getAll("imagefiles")
    .filter((file): file is File => file instanceof File && file.size > 0);
    
    let imageUrl = "";
    let imageId = "";
    let images: string[] = [];
    
    if (files.length > 0) {
      for (const file of files) {
        const uploaded = await imageStore.uploadImage(file);
        
        images.push(uploaded.url);
        
        if (!imageUrl) {
          imageUrl = uploaded.url;
          imageId = uploaded.public_id;
        }
      }
    }
    
    const placemarkData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      latitude: Number(formData.get("latitude")),
      longitude: Number(formData.get("longitude")),
      category: formData.get("category") as string,
      yearEstablished: Number(formData.get("yearEstablished")),
      county: formData.get("county") as string,
      userid: formData.get("userid") as string,
      img: imageUrl,
      imgId: imageId,
      images
    };
    
    await placemarkMongoStore.addPlacemark(collectionId, placemarkData);
    
    return true;
  },
  
  async deletePlacemark(id: string) {
    await placemarkMongoStore.deletePlacemarkById(id);
    return true;
  },
  
  async updatePlacemark(id: string, placemarkData: any) {
    await placemarkMongoStore.updatePlacemark(id, placemarkData);
    return true;
  }
};