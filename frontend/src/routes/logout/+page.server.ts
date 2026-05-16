import { redirect } from "@sveltejs/kit";

export const load = async ({ cookies }) => {

  cookies.delete(
    "placemark-user",
    {
      path: "/"
    }
  );

  throw redirect(302, "/");
};