import { collectionService } from "$lib/services/collection-service";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {

  const { session } = await parent();

  if (session) {

    const collections =
      await collectionService.getCollections(session.token);

    return {
      collections
    };
  }

  return {
    collections: []
  };
};