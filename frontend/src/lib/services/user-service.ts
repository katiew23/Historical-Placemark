import bcrypt from "bcryptjs";
import { userMongoStore } from "$lib/models/mongo/user-store";
import type { User } from "$lib/models/mongo/user";

export const userService = {
  async signup(user: User): Promise<boolean> {
    try {
      console.log("SIGNUP ATTEMPT:", user.email);

      const hashedPassword = await bcrypt.hash(user.password, 10);

      const newUser = await userMongoStore.addUser({
        ...user,
        password: hashedPassword
      });

      console.log("SIGNUP SUCCESS:", user.email);

      return !!newUser;
    } catch (error) {
      console.log("SIGNUP ERROR:", error);
      return false;
    }
  },

  async login(email: string, password: string) {
    try {
      console.log("LOGIN ATTEMPT:", email);

      const user = await userMongoStore.getUserByEmail(email);

      if (!user) {
        console.log("LOGIN FAILED - USER NOT FOUND:", email);
        return null;
      }

      const storedPassword = user.password || "";

      const isHashedPassword =
        storedPassword.startsWith("$2a$") ||
        storedPassword.startsWith("$2b$") ||
        storedPassword.startsWith("$2y$");

      const passwordMatch = isHashedPassword
        ? await bcrypt.compare(password, storedPassword)
        : storedPassword === password;

      if (passwordMatch) {
        console.log("LOGIN SUCCESS:", user.email);

        return {
          token: user._id?.toString() || "",
          role: user.role || "user",
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          _id: user._id?.toString() || ""
        };
      }

      console.log("LOGIN FAILED - INVALID PASSWORD:", email);

      return null;
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      return null;
    }
  }
};

//Authentication is handled using MongoDB user records and server-side cookies. After login, the user session is stored in a placemark-user cookie.