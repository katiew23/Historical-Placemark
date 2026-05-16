import { adminService } from "$lib/services/admin-service";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  parent
}) => {

  const { session } = await parent();

  try {

    if (!session) {

      return {

        users: [],
        collections: [],
        placemarks: [],

        userCount: 0,
        collectionCount: 0,
        placemarkCount: 0,

        categoryLabels: [],
        categoryCounts: [],

        roleLabels: [],
        roleCounts: [],

        countyLabels: [],
        countyCounts: [],

        session: null
      };
    }

    const usersResponse =
      await adminService.getUsers(
        session.token
      );

    const collectionsResponse =
      await adminService.getCollections(
        session.token
      );

    const placemarksResponse =
      await adminService.getPlacemarks(
        session.token
      );

    const users =
      usersResponse.users || usersResponse;

    const collections =
      collectionsResponse.collections || collectionsResponse;

    const placemarks =
      placemarksResponse.placemarks || placemarksResponse;

    // CATEGORY CHART

    const categoryMap: Record<string, number> = {};

    placemarks.forEach((p: any) => {

      if (!categoryMap[p.category]) {

        categoryMap[p.category] = 0;
      }

      categoryMap[p.category]++;
    });

    const categoryLabels =
      Object.keys(categoryMap);

    const categoryCounts =
      Object.values(categoryMap);

    // ROLE CHART

    const roleMap: Record<string, number> = {};

    users.forEach((u: any) => {

      if (!roleMap[u.role]) {

        roleMap[u.role] = 0;
      }

      roleMap[u.role]++;
    });

    const roleLabels =
      Object.keys(roleMap);

    const roleCounts =
      Object.values(roleMap);

    // COUNTY CHART

    const countyMap: Record<string, number> = {};

    placemarks.forEach((p: any) => {

      if (!countyMap[p.county]) {

        countyMap[p.county] = 0;
      }

      countyMap[p.county]++;
    });

    const countyLabels =
      Object.keys(countyMap);

    const countyCounts =
      Object.values(countyMap);

    return {

      users,
      collections,
      placemarks,

      userCount:
        users.length,

      collectionCount:
        collections.length,

      placemarkCount:
        placemarks.length,

      categoryLabels,
      categoryCounts,

      roleLabels,
      roleCounts,

      countyLabels,
      countyCounts,

      session
    };

  } catch (err) {

    console.log(
      "ADMIN SERVER ERROR:",
      err
    );

    return {

      users: [],
      collections: [],
      placemarks: [],

      userCount: 0,
      collectionCount: 0,
      placemarkCount: 0,

      categoryLabels: [],
      categoryCounts: [],

      roleLabels: [],
      roleCounts: [],

      countyLabels: [],
      countyCounts: [],

      session
    };
  }
};