import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ cookies }) => {
  const cookieStr = cookies.get("placemark-user");

  console.log("Checking placemark-user cookie in layout server load");

  if (cookieStr) {
    try {
      const session = JSON.parse(cookieStr);

      console.log("Session cookie found for user:", session.email);

      return {
        session
      };
    } catch (error) {
      console.log("Invalid placemark-user cookie:", error);

      return {
        session: null
      };
    }
  }

  console.log("No placemark-user cookie found");

  return {
    session: null
  };
};

// This file is used to load data for the layout component of the application. It checks for a cookie named "placemark-user" and if it exists, it parses the cookie value as JSON and returns it as part of the session object. If the cookie does not exist, it returns null for the session.