import { api } from "./api";

export const adminService = {

  async getUsers(token: string) {

    const response = await api.get(
      "/users",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
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

  async getPlacemarks(token: string) {

    const response = await api.get(
      "/placemarks",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  },

  async deleteUser(
    id: string,
    token: string
  ) {

    return await api.delete(
      `/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  },

  async deleteCollection(
    id: string,
    token: string
  ) {

    return await api.delete(
      `/collections/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  },

  async deletePlacemark(
    id: string,
    token: string
  ) {

    return await api.delete(
      `/placemarks/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
};