import Boom from "@hapi/boom";
import { validationError } from "../logger.js";
import { db } from "../models/db.js";
import { IdSpec, CollectionCreateSpec, CollectionSpecPlus, CollectionArraySpec } from "../models/joi-schemas.js";

export const collectionApi = {
  
  find: {
    auth: {
      strategy: "jwt"
    },
    handler: async function (request, h) {
      try {
        const collections = await db.collectionStore.getAllCollections();
        return collections;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all collections",
    notes: "Returns all collections in the database",
    response: { schema: CollectionArraySpec, failAction: validationError },
  },
  
  findOne: {
    auth: {
      strategy: "jwt"
    },
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
    tags: ["api"],
    description: "Get a collection",
    notes: "Returns a collection with the id passed in the path",
    response: { schema: CollectionSpecPlus, failAction: validationError },
    validate: { params: { id: IdSpec }, failAction: validationError },
  },
  
  create: {
    auth: {
      strategy: "jwt"
    },
    handler: async function (request, h) {
      try {
        const collection = request.payload;
        collection.userid = request.auth.credentials.id;
        
        const newCollection = await db.collectionStore.addCollection(collection);
        
        if (newCollection) {
          return h.response(newCollection).code(201);
        }
        return Boom.badRequest("Invalid collection data");
        
      } catch (err) {
        console.log(err);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a collection",
    notes: "Creates a collection from the payload and returns the new collection",
    response: { schema: CollectionSpecPlus, failAction: validationError },
    validate: { payload: CollectionCreateSpec, failAction: function (request, h, error) { throw error; } },
  },
  
  deleteOne: {
    auth: {
      strategy: "jwt"
    },
    handler: async function (request, h) {
      try {
        const collection = await db.collectionStore.getCollectionById(request.params.id);
        if (!collection) {
          return Boom.notFound("No Collection with this id");
        }
        await db.collectionStore.deleteCollectionById(collection._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete a collection",
    notes: "Deletes a collection with the id passed in the path",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },
  
  deleteAll: {
    auth: {
      strategy: "jwt"
    },
    handler: async function (request, h) {
      try {
        await db.collectionStore.deleteAllCollections();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all collections",
    notes: "Deletes all collections from the database",
  },
  
};

// Collection API endpoints for CRUD operations on collections
// Each handler is called by the Hapi routes when the API endpoints are hit
// JWT auth protects the routes so only authenticated users can access the API
// Joi schemas validate incoming params/payloads and also document responses for Swagger
// Boom is used to return standard HTTP errors (404 not found, 400 bad request, 503 database error)
