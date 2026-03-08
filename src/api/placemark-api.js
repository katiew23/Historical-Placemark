import Boom from "@hapi/boom";
import { validationError } from "../logger.js";
import { db } from "../models/db.js";
import { IdSpec, PlacemarkSpec, PlacemarkArraySpec, PlacemarkResponseSpec } from "../models/joi-schemas.js";

export const placemarkApi = {
  
  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        const placemarks = await db.placemarkStore.getAllPlacemarks();
        return placemarks;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all placemarks",
    notes: "Returns all placemarks in the database",
    response: { schema: PlacemarkArraySpec, failAction: validationError }
  },
  
  findOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
        if (!placemark) {
          return Boom.notFound("No placemark with this id");
        }
        return placemark;
      } catch (err) {
        return Boom.serverUnavailable("No placemark with this id");
      }
    },
    tags: ["api"],
    description: "Get a placemark",
    notes: "Returns a placemark with the id passed in the path",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: PlacemarkResponseSpec, failAction: validationError }
  },
  
  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const placemark = await db.placemarkStore.addPlacemark(
          request.params.id,
          request.payload
        );
        
        if (placemark) {
          return h.response(placemark).code(201);
        }
        
        return Boom.badRequest("Invalid placemark data");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a placemark",
    notes: "Creates a placemark from the payload and returns the new placemark",
    response: { schema: PlacemarkResponseSpec, failAction: validationError },
    validate: {
      params: { id: IdSpec },
      payload: PlacemarkSpec,
      failAction: function (request, h, error) {
        throw error;
      }
    }
  },
  
  deleteOne: {
    auth: false,
    async handler(request, h) {
      try {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
        
        if (!placemark) {
          return Boom.notFound("No placemark with this id");
        }
        
        await db.placemarkStore.deletePlacemarkById(placemark._id);
        return h.response().code(204);
        
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete a placemark",
    notes: "Deletes a placemark with the id passed in the path",
    validate: { params: { id: IdSpec }, failAction: validationError }
  },
  
  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.placemarkStore.deleteAllPlacemarks();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all placemarks",
    notes: "Deletes all placemarks from the database"
  }
  
};

//create requests should only contain the data the user sends, not the data the database adds (e.g. _id, collectionid, __v). The response schema represents the object returned by the database after a placemark is created, which includes the additional fields added by the database. The find and findOne requests return the full placemark object as stored in the database, so their response schema also includes the additional fields.
//joi validation controls the api behaviour when the request data does not match the expected schema. If the payload or params do not match the schema, the failAction function is called, which in this case throws the validation error. This results in a 400 Bad Request response being sent back to the client, along with details about what part of the request data was invalid. This helps ensure that only valid data is processed by the API and provides feedback to clients about how to correct their requests.
//tests verify api contracts by sending requests with both valid and invalid data and checking the responses. For example, a test for the create placemark endpoint would send a POST request with a valid placemark payload and expect a 201 Created response with the new placemark in the body. It would also send a POST request with an invalid payload (e.g. missing required fields) and expect a 400 Bad Request response with details about the validation error. By testing both successful and unsuccessful scenarios, we can ensure that the API behaves correctly in all cases.