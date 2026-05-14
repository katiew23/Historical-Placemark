import { api } from "./api";

export const adminService = {

  async getUsers() {

    const response = await api.get("/users");

    return response.data;
  },

  async getCollections() {

    const response = await api.get("/collections");

    return response.data;
  },

  async getPlacemarks() {

    const response = await api.get("/placemarks");

    return response.data;
  },

  async deleteUser(id: string) {

    return await api.delete(`/users/${id}`);
  },

  async deleteCollection(id: string) {

    return await api.delete(`/collections/${id}`);
  },

  async deletePlacemark(id: string) {

    return await api.delete(`/placemarks/${id}`);
  }
};