import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ cookies }) => {

  const cookieStr = cookies.get("placemark-user");

  if (cookieStr) {

    const session = JSON.parse(cookieStr);

    return {
      session
    };
  }

  return {
    session: null
  };
};