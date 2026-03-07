import Boom from "@hapi/boom";
import { validationError } from "../logger.js";
import { db } from "../models/db.js";
import {PlacemarkSpec, PlacemarkArraySpec,PlacemarkResponseSpec} from "../models/joi-schemas.js";

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
    response: { schema: PlacemarkResponseSpec, failAction: validationError }
  },

  create: {
    auth: false,
    validate: {
      payload: PlacemarkSpec,
      options: {
        abortEarly: false
      }
    },
    handler: async function (request, h) {
      try {
        const placemark = await db.placemarkStore.addPlacemark(
          request.params.id,
          request.payload
        );

        if (placemark) {
          return h.response(placemark).code(201);
        }

        return Boom.badImplementation("error creating placemark");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a placemark",
    notes: "Creates a placemark from the payload and returns the new placemark",
    response: { schema: PlacemarkResponseSpec, failAction: validationError }
  },

  deleteOne: {
    auth: false,
    async handler(request, h) {
      try {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);

        if (!placemark) {
          return Boom.notFound("No placemark with this id");
        }

        await db.placemarkStore.deletePlacemarkById(request.params.id);
        return h.response().code(204);

      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete a placemark",
    notes: "Deletes a placemark with the id passed in the path"
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