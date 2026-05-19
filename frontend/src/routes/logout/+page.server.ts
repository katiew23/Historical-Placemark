import { redirect } from "@sveltejs/kit";

export const load = async ({ cookies }) => {

  cookies.delete( //clears the login session cookie to log the user out
    "placemark-user",
    {
      path: "/"
    }
  );

  throw redirect(302, "/"); //redirects the user back to the homepage after logging out
};