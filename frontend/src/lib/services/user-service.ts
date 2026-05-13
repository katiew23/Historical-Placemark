import { api } from "./api";

export const userService = {

  async signup(user) {

    try {

      const response = await api.post(
        "/users",
        user
      );

      return response.status === 201;

    } catch {

      return false;
    }
  },

  async login(email, password) {

    try {

      const response = await api.post(
        "/users/authenticate",
        {
          email,
          password
        }
      );

      return response.data;

    } catch {

      return null;
    }
  }
};