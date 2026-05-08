import Boom from "@hapi/boom";
import { validationError } from "../logger.js";
import { db } from "../models/db.js";
import {
  IdSpec,
  PlacemarkSpec,
  PlacemarkArraySpec,
  PlacemarkResponseSpec
} from "../models/joi-schemas.js";
import { imageStore } from "../models/image-store.js";

export const placemarkApi = {
  
  find: {
    auth: { strategy: "jwt" },
    
    handler: async function (request, h) {
      
      try {
        
        return await db.placemarkStore.getAllPlacemarks();
        
      } catch {
        
        return Boom.serverUnavailable("Database Error");
      }
    },
    
    tags: ["api"],
    
    response: {
      schema: PlacemarkArraySpec,
      failAction: validationError
    }
  },
  
  findOne: {
    auth: { strategy: "jwt" },
    
    handler: async function (request, h) {
      
      try {
        
        const placemark =
        await db.placemarkStore.getPlacemarkById(request.params.id);
        
        if (!placemark) {
          return Boom.notFound("No placemark with this id");
        }
        
        return placemark;
        
      } catch {
        
        return Boom.serverUnavailable("No placemark with this id");
      }
    },
    
    validate: {
      params: { id: IdSpec },
      failAction: validationError
    },
    
    response: {
      schema: PlacemarkResponseSpec,
      failAction: validationError
    }
  },
  
  create: {
    auth: { strategy: "jwt" },
    
    payload: {
    output: "file",
    parse: true,
    multipart: true
     },
    validate: {
      params: { id: IdSpec },
      payload: PlacemarkSpec,
      failAction: validationError
    },
    
    handler: async function (request, h) {
      
      try {
        
        const file = request.payload.imagefiles;
        
        let imageUrl = "";
        let imageId = "";
        
        if (file) {
          
          const uploaded = await imageStore.uploadImage(file);
          
          imageUrl = uploaded.url;
          imageId = uploaded.public_id;
        }
        
        const placemarkData = {
          name: request.payload.name,
          description: request.payload.description,
          latitude: Number(request.payload.latitude),
          longitude: Number(request.payload.longitude),
          category: request.payload.category,
          yearEstablished: Number(request.payload.yearEstablished),
          county: request.payload.county,
          
          img: imageUrl,
          imgId: imageId,
          
          images: imageUrl ? [imageUrl] : []
        };
        
        const placemark =
        await db.placemarkStore.addPlacemark(
          request.params.id,
          placemarkData
        );
        
        return h.response(placemark).code(201);
        
      } catch (err) {
        
        console.log("CREATE ERROR:", err);
        
        return Boom.serverUnavailable("Database Error");
      }
    },
    
    validate: {
      params: { id: IdSpec },
      failAction: validationError
    },
    
    response: {
      schema: PlacemarkResponseSpec,
      failAction: validationError
    }
  },
  
  deleteAll: {
    auth: {
      strategy: "jwt"
    },
    
    handler: async function (request, h) {
      
      try {
        
        await db.placemarkStore.deleteAllPlacemarks();
        
        return h.response().code(204);
        
      } catch (err) {
        
        console.log("DELETE ALL ERROR:", err);
        
        return Boom.serverUnavailable("Database Error");
      }
    },
    
    tags: ["api"],
    
    description: "Delete all placemarks",
    
    notes: "Deletes all placemarks from the database"
  },
  
  deleteOne: {
    auth: { strategy: "jwt" },
    
    handler: async function (request, h) {
      
      try {
        
        const placemark =
        await db.placemarkStore.getPlacemarkById(request.params.id);
        
        if (!placemark) {
          return Boom.notFound("No placemark with this id");
        }
        
        await db.placemarkStore.deletePlacemarkById(request.params.id);
        
        return h.response().code(204);
        
      } catch (err) {
        
        console.log(err);
        
        return Boom.serverUnavailable("Database Error");
      }
    },
    
    validate: {
      params: { id: IdSpec },
      failAction: validationError
    }
  },
  
  update: {
    auth: { strategy: "jwt" },
    
    handler: async function (request, h) {
      
      try {
        
        const placemark =
        await db.placemarkStore.getPlacemarkById(request.params.id);
        
        if (!placemark) {
          return Boom.notFound("No placemark with this id");
        }
        
        await db.placemarkStore.updatePlacemark(
          request.params.id,
          request.payload
        );
        
        return h.response().code(204);
        
      } catch {
        
        return Boom.serverUnavailable("Database Error");
      }
    },
    
    validate: {
      params: { id: IdSpec },
      payload: PlacemarkSpec,
      failAction: validationError
    }
  },
  
  uploadImage: {
    auth: {
      strategy: "jwt"
    },
    
    payload: {
      output: "file",
      parse: true,
      multipart: true
    },
    
    validate: {
      params: { id: IdSpec },
      failAction: validationError
    },
    
    handler: async function (request, h) {
      
      try {
        
        console.log("UPLOAD FUNCTION RUNNING");
        
        let files = request.payload.imagefiles;
        
        if (!files) {
          return Boom.badRequest("No file uploaded");
        }
        
        if (!Array.isArray(files)) {
          files = [files];
        }
        
        const placemark =
        await db.placemarkStore.getPlacemarkById(request.params.id);
        
        if (!placemark) {
          return Boom.notFound("Placemark not found");
        }
        
        const uploadedImages = [];
        
        for (const file of files) {
          
          const uploaded = await imageStore.uploadImage(file);
          
          uploadedImages.push(uploaded.url);
        }
        
        const existingImages = placemark.images || [];
        
        await db.placemarkStore.updatePlacemark(request.params.id, {
          
          images: [...existingImages, ...uploadedImages],
          
          img: placemark.img || uploadedImages[0]
        });
        
        return { success: true };
        
      } catch (err) {
        
        console.log("UPLOAD ERROR:", err);
        
        return Boom.serverUnavailable("Upload failed");
      }
    },
    
    tags: ["api"],
    
    description: "Upload images for placemark"
  },
  
  addReview: {
    auth: {
      strategy: "jwt"
    },
    
    handler: async function (request, h) {
      
      try {
        
        const review = {
          name: request.payload.name,
          text: request.payload.text,
          rating: request.payload.rating
        };
        
        await db.placemarkStore.addReview(
          request.params.id,
          review
        );
        
        return h.response().code(201);
        
      } catch (err) {
        
        console.log(err);
        
        return Boom.serverUnavailable("Database Error");
      }
    }
  },
  
  deleteReview: {
    auth: {
      strategy: "jwt"
    },
    
    handler: async function (request, h) {
      
      try {
        
        await db.placemarkStore.deleteReview(
          request.params.id,
          request.params.index
        );
        
        return h.response().code(204);
        
      } catch (err) {
        
        console.log(err);
        
        return Boom.serverUnavailable("Database Error");
      }
    }
  },
  
  updateReview: {
    auth: {
      strategy: "jwt"
    },
    
    handler: async function (request, h) {
      
      try {
        
        await db.placemarkStore.updateReview(
          request.params.id,
          request.params.index,
          request.payload
        );
        
        return h.response().code(204);
        
      } catch (err) {
        
        console.log(err);
        
        return Boom.serverUnavailable("Database Error");
      }
    }
  }
  
};

// create requests should only contain the data the user sends, not the data the database adds (e.g. _id, collectionid, __v). The response schema represents the object returned by the database after a placemark is created, which includes the additional fields added by the database. The find and findOne requests return the full placemark object as stored in the database, so their response schema also includes the additional fields.
// joi validation controls the api behaviour when the request data does not match the expected schema. If the payload or params do not match the schema, the failAction function is called, which in this case throws the validation error. This results in a 400 Bad Request response being sent back to the client, along with details about what part of the request data was invalid. This helps ensure that only valid data is processed by the API and provides feedback to clients about how to correct their requests.
// tests verify api contracts by sending requests with both valid and invalid data and checking the responses. For example, a test for the create placemark endpoint would send a POST request with a valid placemark payload and expect a 201 Created response with the new placemark in the body. It would also send a POST request with an invalid payload (e.g. missing required fields) and expect a 400 Bad Request response with details about the validation error. By testing both successful and unsuccessful scenarios, we can ensure that the API behaves correctly in all cases.
// Collection API endpoints for CRUD operations on collections
// Each handler is called by the Hapi routes when the API endpoints are hit
// JWT auth protects the routes so only authenticated users can access the API
// Joi schemas validate incoming params/payloads and also document responses for Swagger
// Boom is used to return standard HTTP errors (404 not found, 400 bad request, 503 database error)