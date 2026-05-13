import Boom from "@hapi/boom";
import { validationError } from "../logger.js";
import { db } from "../models/db.js";
import {
  IdSpec,
  CollectionCreateSpec,
  CollectionSpecPlus,
  CollectionArraySpec
} from "../models/joi-schemas.js";

export const collectionApi = {
  
  find: {
    auth: {
      strategy: "jwt"
    },
    
    handler: async function (request, h) {
      
      try {
        
        const userid = request.auth.credentials._id;
        
        const collections =
        await db.collectionStore.getUserCollections(userid);
        
        return collections;
        
      } catch (err) {
        
        console.log("FIND COLLECTIONS ERROR:", err);
        
        return Boom.serverUnavailable("Database Error");
      }
    },
    
    tags: ["api"],
    
    description: "Get user collections",
    
    notes: "Returns collections for logged in user only",
    
    response: {
      schema: CollectionArraySpec,
      failAction: validationError
    },
  },
  
  findOne: {
    auth: {
      strategy: "jwt"
    },
    
    handler: async function (request, h) {
      
      try {
        
        const collection =
        await db.collectionStore.getCollectionById(
          request.params.id
        );
        
        if (!collection) {
          return Boom.notFound(
            "No Collection with this id"
          );
        }
        
        return collection;
        
      } catch (err) {
        
        console.log("FIND ONE COLLECTION ERROR:", err);
        
        return Boom.serverUnavailable("Database Error");
      }
    },
    
    tags: ["api"],
    
    description: "Get a collection",
    
    notes: "Returns a collection with the id passed in the path",
    
    response: {
      schema: CollectionSpecPlus,
      failAction: validationError
    },
    
    validate: {
      params: { id: IdSpec },
      failAction: validationError
    },
  },
  
  create: {
    auth: {
      strategy: "jwt"
    },
    
    handler: async function (request, h) {
      
      try {
        
        const collection = request.payload;
        
        collection.userid =
        request.auth.credentials._id;
        
        console.log("COLLECTION USER:", collection.userid);
        
        const newCollection =
        await db.collectionStore.addCollection(
          collection
        );
        
        console.log(
          "COLLECTION SAVED:",
          newCollection
        );
        
        if (newCollection) {
          
          return h.response(newCollection).code(201);
        }
        
        return Boom.badRequest(
          "Invalid collection data"
        );
        
      } catch (err) {
        
        console.log("CREATE COLLECTION ERROR:", err);
        
        return Boom.serverUnavailable("Database Error");
      }
    },
    
    tags: ["api"],
    
    description: "Create a collection",
    
    notes:
    "Creates a collection from the payload and returns the new collection",
    
    response: {
      schema: CollectionSpecPlus,
      failAction: validationError
    },
    
    validate: {
      payload: CollectionCreateSpec,
      
      failAction: function (request, h, error) {
        
        throw error;
      }
    },
  },
  
  deleteOne: {
    auth: {
      strategy: "jwt"
    },
    
    handler: async function (request, h) {
      
      try {
        
        const collection =
        await db.collectionStore.getCollectionById(
          request.params.id
        );
        
        if (!collection) {
          
          return Boom.notFound(
            "No Collection with this id"
          );
        }
        
        await db.collectionStore.deleteCollectionById(
          collection._id
        );
        
        console.log(
          "COLLECTION DELETED:",
          collection._id
        );
        
        return h.response().code(204);
        
      } catch (err) {
        
        console.log("DELETE COLLECTION ERROR:", err);
        
        return Boom.serverUnavailable("Database Error");
      }
    },
    
    tags: ["api"],
    
    description: "Delete a collection",
    
    notes:
    "Deletes a collection with the id passed in the path",
    
    validate: {
      params: { id: IdSpec },
      failAction: validationError
    },
  },
  
  deleteAll: {
    auth: {
      strategy: "jwt"
    },
    
    handler: async function (request, h) {
      
      try {
        
        await db.collectionStore.deleteAllCollections();
        
        console.log("ALL COLLECTIONS DELETED");
        
        return h.response().code(204);
        
      } catch (err) {
        
        console.log(
          "DELETE ALL COLLECTIONS ERROR:",
          err
        );
        
        return Boom.serverUnavailable("Database Error");
      }
    },
    
    tags: ["api"],
    
    description: "Delete all collections",
    
    notes:
    "Deletes all collections from the database",
  },
  
  update: {
    auth: {
      strategy: "jwt"
    },
    
    handler: async function (request, h) {
      
      try {
        
        const collection =
        await db.collectionStore.getCollectionById(
          request.params.id
        );
        
        if (!collection) {
          
          return Boom.notFound(
            "No Collection with this id"
          );
        }
        
        collection.name = request.payload.name;
        
        await db.collectionStore.updateCollection(
          collection
        );
        
        return h.response(collection).code(200);
        
      } catch (err) {
        
        console.log(
          "UPDATE COLLECTION ERROR:",
          err
        );
        
        return Boom.serverUnavailable(
          "Database Error"
        );
      }
    },
    
    tags: ["api"],
    
    description: "Update a collection",
    
    notes:
    "Updates a collection with the id passed in the path",
    
    validate: {
      params: { id: IdSpec },
      payload: CollectionCreateSpec,
      failAction: validationError
    },
  },
};

// this is the api controller, its used to create the endpoints for api testing 
