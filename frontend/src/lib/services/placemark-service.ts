import { api } from "./api";

export const placemarkService = {

  async getPlacemark(
    id: string,
    token: string
  ) {

    const response = await api.get(
      `/placemarks/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  },

  async uploadImages(
    placemarkId: string,
    formData: FormData,
    token: string
  ) {

    await api.post(
      `/placemarks/${placemarkId}/uploadimage`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return true;
  },

  async saveReview(
    placemarkId: string,
    index: number,
    reviewData: object,
    token: string
  ) {

    await api.put(
      `/placemarks/${placemarkId}/reviews/${index}`,
      reviewData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  },

  async deleteReview(
    placemarkId: string,
    index: number,
    token: string
  ) {

    await api.delete(
      `/placemarks/${placemarkId}/reviews/${index}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
};