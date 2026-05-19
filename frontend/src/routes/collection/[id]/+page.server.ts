import { collectionService } from "$lib/services/collection-service";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, parent }) => {
  const { session } = await parent();

  if (!session) {
    return {
      collection: null,
      session: null
    };
  }

  try {
    const collection = await collectionService.getCollection(params.id);

    return {
      collection,
      session
    };
  } catch (err) {
    console.log("COLLECTION SERVER ERROR:", err);

    return {
      collection: null,
      session
    };
  }
};

export const actions: Actions = {
  addPlacemark: async ({ request, params, cookies }) => {
    const cookieStr = cookies.get("placemark-user");

    if (!cookieStr) {
      return { success: false };
    }

    const session = JSON.parse(cookieStr);

    const form = await request.formData();

    form.append("userid", session.token);

    await collectionService.addPlacemark(params.id, form);

    return { success: true };
  },

  deletePlacemark: async ({ request }) => {
    const form = await request.formData();

    await collectionService.deletePlacemark(
      form.get("id") as string
    );

    return { success: true };
  },

  updatePlacemark: async ({ request }) => {
    const form = await request.formData();

    await collectionService.updatePlacemark(
      form.get("id") as string,
      {
        name: form.get("name") as string,
        description: form.get("description") as string,
        latitude: Number(form.get("latitude")),
        longitude: Number(form.get("longitude")),
        category: form.get("category") as string,
        yearEstablished: Number(form.get("yearEstablished")),
        county: form.get("county") as string
      }
    );

    return { success: true };
  }
};
//server side crud for placemarks, load, add, delete and update. Also handles image uploads and review saving for placemarks.