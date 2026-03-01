import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { CollectionSpec } from "../models/joi-schemas.js";


export const collectionApi = {

  find: {
    auth: false,    
    handler: async function (request, h) {
      try {
        const collections = await db.collectionStore.getAllCollections();
        return collections;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  findOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const collection = await db.collectionStore.getCollectionById(request.params.id);
        if (!collection) {
          return Boom.notFound("No Collection with this id");
        }
        return collection;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  create: {
    auth: false,
    validate: {
      payload: CollectionSpec,
      options: {
        abortEarly: false,
      },
    },
    handler: async function (request, h) {
      try {
        const collection = await db.collectionStore.addCollection(request.payload);
        if (collection) {
          return h.response(collection).code(201);
        }
        return Boom.badImplementation("error creating collection");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  deleteOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const collection = await db.collectionStore.getCollectionById(request.params.id);
        if (!collection) {
          return Boom.notFound("No Collection with this id");
        }
        await db.collectionStore.deleteCollectionById(request.params.id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.collectionStore.deleteAllCollections();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

};
