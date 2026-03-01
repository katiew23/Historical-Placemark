import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { PlacemarkSpec } from "../models/joi-schemas.js";


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
    },
    
    create: {
        auth: false,
        validate: {
            payload: PlacemarkSpec,
            options: {
                abortEarly: false,
            },
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
    },
    
    deleteOne: {
        auth: false,
        async handler(request, h) {
            try {
                console.log("DELETE ID:", request.params.id);
                
                const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
                console.log("FOUND:", placemark);
                
                if (!placemark) {
                    return Boom.notFound("No placemark with this id");
                }
                
                await db.placemarkStore.deletePlacemarkById(request.params.id);
                return h.response().code(204);
                
            } catch (err) {
                console.log("ERROR:", err);
                return Boom.serverUnavailable("Database Error");
            }
        },
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
    },
};