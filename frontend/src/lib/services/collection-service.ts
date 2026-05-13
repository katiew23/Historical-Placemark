import { api } from "./api";

export const collectionService = {
  
  async getCollection(id: string) {
    
    const response = await api.get(
      `/collections/${id}`
    );
    
    return response.data;
  },
  
  async updateCollection(
    id: string,
    collectionData: object
  ) {
    
    await api.put(
      `/collections/${id}`,
      collectionData
    );
    
    return true;
  },
  
  async getCollections() {
    
    const response = await api.get(
      "/collections"
    );
    
    return response.data;
  },
  
  async addCollection(collectionData: object) {
    
    await api.post(
      "/collections",
      collectionData
    );
    
    return true;
  },
  
  async deleteCollection(id: string) {
    
    await api.delete(
      `/collections/${id}`
    );
    
    return true;
  },
  
  async addPlacemark(
    collectionId: string,
    formData: FormData
  ) {
    
    await api.post(
      `/collections/${collectionId}/placemarks`,
      formData
    );
    
    return true;
  },
  
  async deletePlacemark(id: string) {
    
    await api.delete(
      `/placemarks/${id}`
    );
    
    return true;
  },
  
  async updatePlacemark(
    id: string,
    placemarkData: object
  ) {
    
    await api.put(
      `/placemarks/${id}`,
      placemarkData
    );
    
    return true;
  }
};