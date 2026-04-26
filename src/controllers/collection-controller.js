import { db } from "../models/db.js";
import { PlacemarkSpec } from "../models/joi-schemas.js";
import { imageStore } from "../models/image-store.js";


export const collectionController = {
  
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const collection = await db.collectionStore.getCollectionById(request.params.id);
      const placemarks = await db.placemarkStore.getPlacemarksByCollectionId(collection._id);
      
      const placemarksByCategory = {};
      
      placemarks.forEach(function (placemark) {
        const category = placemark.category || "Uncategorised";
        
        if (!placemarksByCategory[category]) {
          placemarksByCategory[category] = [];
        }
        
        placemarksByCategory[category].push(placemark);
      });  // loads collection, loads placemarks, groups placemarks by category
      
      const viewData = {
        title: "Collection",
        collection: collection,
        placemarks: placemarks,
        placemarksByCategory: placemarksByCategory,
        placemarksJson: JSON.stringify(placemarks),
        role: loggedInUser.role
      };
      
      return h.view("collection-view", viewData);
    }
  },
  
  addPlacemark: { validate: {payload: PlacemarkSpec,
    options: { abortEarly: false },
    failAction: function (request, h, error) { return h.view("collection-view", {
      title: "Add placemark error",
      errors: error.details
    }).takeover().code(400);
  }
}, 

handler: async function (request, h) {
  const collection = await db.collectionStore.getCollectionById(request.params.id);
  
  const newPlacemark = {
    name: request.payload.name,
    description: request.payload.description,
    latitude: Number(request.payload.latitude),
    longitude: Number(request.payload.longitude),
    category: request.payload.category,
    yearEstablished: Number(request.payload.yearEstablished),
    county: request.payload.county
  };
  
  await db.placemarkStore.addPlacemark(collection._id, newPlacemark);
  
  return h.redirect(`/collection/${collection._id}`);
}
},

deletePlacemark: {
  handler: async function (request, h) {
    const collection = await db.collectionStore.getCollectionById(request.params.id);
    
    await db.placemarkStore.deletePlacemark(request.params.placemarkid);
    
    return h.redirect(`/collection/${collection._id}`);
  }
},

uploadImage: {
  handler: async function (request, h) {
    try {
      const collection = await db.collectionStore.getCollectionById(request.params.id);
      const file = request.payload.imagefile;
      
      if (file) {
        const url = await imageStore.uploadImage(file);
        console.log("IMAGE URL:", url);
        
        collection.img = url;
        await db.collectionStore.updateCollection(collection);
      }
      
      return h.redirect(`/collection/${collection._id}`);
    } catch (err) {
      console.log(err);
      return h.redirect(`/collection/${request.params.id}`);
    }
  },
  
  payload: {
    multipart: true,
    output: "file",
    maxBytes: 209715200,
    parse: true
  }
},

deleteImage: {
  handler: async function (request, h) {
    const collection = await db.collectionStore.getCollectionById(request.params.id);
    
    if (collection.img) {
      await imageStore.deleteImage(collection.img);
      collection.img = "";
      await db.collectionStore.updateCollection(collection);
    }
    
    return h.redirect(`/collection/${collection._id}`);
  }
},
showEditPlacemark: {
  handler: async function (request, h) {
    const collection = await db.collectionStore.getCollectionById(request.params.id);
    const placemark = await db.placemarkStore.getPlacemarkById(request.params.placemarkid);

    return h.view("edit-placemark-view", {
      collection,
      placemark,
    });
  }
},

updatePlacemark: {
  handler: async function (request, h) {
    const updatedPlacemark = {
      name: request.payload.name,
      description: request.payload.description,
      latitude: request.payload.latitude,
      longitude: request.payload.longitude,
      category: request.payload.category,
      yearEstablished: request.payload.yearEstablished,
      county: request.payload.county,
    };

    await db.placemarkStore.updatePlacemark(request.params.placemarkid, updatedPlacemark);

    return h.redirect(`/collection/${request.params.id}`);
  }
}
};

// controls what happens inside a collection page
// handles placemark crud 
// handles collection image upload/delete
// prepares data for the collection view

// validate payload checking the data being sent and ok to continue

