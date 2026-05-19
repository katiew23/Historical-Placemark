import { collectionService } from "$lib/services/collection-service";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { session } = await parent();

  if (session) {
    const collections = await collectionService.getCollections();

    return {
      collections
    };
  }

  return {
    collections: []
  };
};

export const actions: Actions = {
  addCollection: async ({ request, cookies }) => {
    const cookieStr = cookies.get("placemark-user");

    if (!cookieStr) {
      return { success: false };
    }

    const session = JSON.parse(cookieStr);

    const form = await request.formData();

    await collectionService.addCollection({
      name: form.get("name") as string,
      userid: session.token
    });

    return { success: true };
  },

  deleteCollection: async ({ request }) => {
    const form = await request.formData();

    const id = form.get("id") as string;

    await collectionService.deleteCollection(id);

    return { success: true };
  },

  updateCollection: async ({ request }) => {
    const form = await request.formData();

    await collectionService.updateCollection(
      form.get("id") as string,
      {
        name: form.get("name") as string
      }
    );

    return { success: true };
  }
};

//server side crud for collections, load, add, delete and update. 