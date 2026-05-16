import { placemarkService } from "$lib/services/placemark-service";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  params,
  parent
}) => {

  const { session } = await parent();

  try {

    if (session) {

      const placemark =
        await placemarkService.getPlacemark(
          params.id,
          session.token
        );

      console.log(
        "PLACEMARK:",
        placemark
      );

      return {
        placemark,
        session
      };
    }

    return {
      placemark: null,
      session: null
    };

  } catch (err: any) {

    console.log(
      "SERVER LOAD ERROR:",
      err.response?.data
    );

    console.log(
      "STATUS:",
      err.response?.status
    );

    return {
      placemark: null,
      session: null
    };
  }
};