import { placemarkService } from "$lib/services/placemark-service";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, parent }) => { //load the placemark before the page displays
  const { session } = await parent(); //this gets the logged in session from +layout.server.ts

  try {
    if (session) {
      const placemark = await placemarkService.getPlacemark(params.id); //this get the placemark from MongoDB using the id in the URL

      return {
        placemark,
        session
      };
    }

    return {
      placemark: null,
      session: null
    };
  } catch (err) {
    console.log("SERVER LOAD ERROR:", err);

    return {
      placemark: null,
      session: null
    };
  }
};

export const actions: Actions = {
  uploadImages: async ({ request, params, cookies }) => {
    try {
      const cookieStr = cookies.get("placemark-user");

      if (!cookieStr) {
        console.log("UPLOAD ERROR: no session cookie");
        return { success: false };
      }

      const session = JSON.parse(cookieStr);

      const form = await request.formData();

      console.log("UPLOAD ACTION RUNNING");
      console.log("PLACEMARK ID:", params.id);
      console.log("USER ID:", session.token);
      console.log("FILES:", form.getAll("imagefiles").length);

      const result = await placemarkService.uploadImages(
        params.id,
        form,
        session.token
      );

      console.log("UPLOAD RESULT:", result);

      return { success: result };
    } catch (err) {
      console.log("UPLOAD ACTION ERROR:", err);

      return { success: false };
    }
  },

  saveReview: async ({ request, params }) => {
    try {
      const form = await request.formData();

      await placemarkService.saveReview(
        params.id,
        Number(form.get("index")),
        {
          name: form.get("name") as string,
          text: form.get("text") as string,
          rating: Number(form.get("rating"))
        }
      );

      return { success: true };
    } catch (err) {
      console.log("SAVE REVIEW ACTION ERROR:", err);

      return { success: false };
    }
  },

  deleteReview: async ({ request, params }) => {
    try {
      const form = await request.formData();

      await placemarkService.deleteReview(
        params.id,
        Number(form.get("index"))
      );

      return { success: true };
    } catch (err) {
      console.log("DELETE REVIEW ACTION ERROR:", err);

      return { success: false };
    }
  }
};