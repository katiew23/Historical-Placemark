import { userMongoStore } from "$lib/models/mongo/user-store";
import type { User } from "$lib/models/mongo/user";

export const userService = {
  async signup(user: User): Promise<boolean> {
    try {
      const newUser = await userMongoStore.addUser(user);
      return !!newUser;
    } catch {
      return false;
    }
  },

  async login(email: string, password: string) {
    try {
      const user = await userMongoStore.getUserByEmail(email);

      if (user && user.password === password) {
        return {
          token: user._id?.toString() || "",
          role: user.role || "user",
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          _id: user._id?.toString() || ""
        };
      }

      return null;
    } catch {
      return null;
    }
  }
};

//Authentication is handled using MongoDB user records and server-side cookies. After login, the user session is stored in a placemark-user cookie.