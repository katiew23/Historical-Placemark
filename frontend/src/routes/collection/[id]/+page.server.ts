import { collectionService } from "$lib/services/collection-service";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({
  params,
  parent
}) => {
  
  const { session } = await parent();
  
  console.log("SESSION:", session);
  
  try {
    
    
    console.log("PARAM ID:", params.id);
    console.log("TOKEN:", session.token);
    
    const collection =
    await collectionService.getCollection(
      params.id,
      session.token
    );
    
    console.log("COLLECTION:", collection);
    
    return {
      collection,
      session
    };
    
  } catch (err) {
    
    console.log(
      "COLLECTION SERVER ERROR:",
      err
    );
    
    return {
      collection: null,
      session
    };
  }
};