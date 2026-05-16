import { api } from "./api";

export const collectionService = {

  async getCollection(
    id: string,
    token: string
  ) {

    const response = await api.get(
      `/collections/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  },

  async updateCollection(
    id: string,
    collectionData: object,
    token: string
  ) {

    await api.put(
      `/collections/${id}`,
      collectionData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return true;
  },

  async getCollections(token: string) {

    const response = await api.get(
      "/collections",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  },

  async addCollection(
    collectionData: object,
    token: string
  ) {

    await api.post(
      "/collections",
      collectionData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return true;
  },

  async deleteCollection(
    id: string,
    token: string
  ) {

    await api.delete(
      `/collections/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return true;
  },

  async addPlacemark(
    collectionId: string,
    formData: FormData,
    token: string
  ) {

    await api.post(
      `/collections/${collectionId}/placemarks`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return true;
  },

  async deletePlacemark(
    id: string,
    token: string
  ) {

    await api.delete(
      `/placemarks/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return true;
  },

  async updatePlacemark(
    id: string,
    placemarkData: object,
    token: string
  ) {

    await api.put(
      `/placemarks/${id}`,
      placemarkData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return true;
  }
};