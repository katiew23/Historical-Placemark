import { db } from "../models/db.js";
import { PlacemarkSpec } from "../models/joi-schemas.js";

export const collectionController = {

  index: {
    handler: async function (request, h) {

      const collection = await db.collectionStore.getCollectionById(request.params.id);
      const placemarks = await db.placemarkStore.getPlacemarksByCollectionId(collection._id);

      // group placemarks by category
      const placemarksByCategory = {};

      placemarks.forEach(function (placemark) {

        const category = placemark.category || "Uncategorised";

        if (!placemarksByCategory[category]) {
          placemarksByCategory[category] = [];
        }

        placemarksByCategory[category].push(placemark);

      });

      const viewData = {
        title: "Collection",
        collection: collection,
        placemarks: placemarks,
        placemarksByCategory: placemarksByCategory,
        placemarksJson: JSON.stringify(placemarks)
      };

      return h.view("collection-view", viewData);
    }
  },

  addPlacemark: {
    validate: {
      payload: PlacemarkSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("collection-view", {
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
  }

};