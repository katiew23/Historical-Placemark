import { api } from "./api";

export const placemarkService = {

  async getPlacemark(id: string) {

    const response = await api.get(
      `/placemarks/${id}`
    );

    return response.data;
  },

  async uploadImages(
    placemarkId: string,
    formData: FormData
  ) {

    await api.post(
      `/placemarks/${placemarkId}/uploadimage`,
      formData
    );

    return true;
  },

  async saveReview(
    placemarkId: string,
    index: number,
    reviewData: object
  ) {

    await api.put(
      `/placemarks/${placemarkId}/reviews/${index}`,
      reviewData
    );
  },

  async deleteReview(
    placemarkId: string,
    index: number
  ) {

    await api.delete(
      `/placemarks/${placemarkId}/reviews/${index}`
    );
  }
};