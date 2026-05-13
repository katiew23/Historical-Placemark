import Boom from "@hapi/boom";
import { validationError } from "../logger.js";
import { db } from "../models/db.js";
import { UserCredentialsSpec, UserSpec, UserSpecPlus, UserArraySpec, AuthTokenSpec}  from "../models/joi-schemas.js";
import { createToken } from "./jwt-utils.js";

export const userApi = {
  
  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserByEmail(request.payload.email);
        if (!user) {
          return Boom.unauthorized("User not found");
        }
        if (user.password !== request.payload.password) {
          return Boom.unauthorized("Invalid password");
        }
       
        
        const token = createToken(user);
        
        const role =
        user.email === "katiew23@gmail.com"
        ? "admin"
        : "user";
        
        return h.response({
          success: true,
          token: token,
          role: role,
            _id: user._id.toString()
        }).code(201);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Authenticate a user",
    notes: "Returns a token if the email and password are valid",
    validate: { payload: UserCredentialsSpec, failAction: validationError },
    response: { schema: AuthTokenSpec, failAction: validationError },
  },
  
  find: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const users = await db.userStore.getAllUsers();
        return users;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all users",
    notes: "Returns all users in the database",
    response: { schema: UserArraySpec, failAction: validationError },
  },
  
  findOne: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserById(request.params.id);
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch (err) {
        return Boom.serverUnavailable("No User with this id");
      }
    },
    tags: ["api"],
    description: "Get a user",
    notes: "Returns a user with the id passed in the path",    
    response: { schema: UserSpecPlus, failAction: validationError },
  },
  
  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await db.userStore.addUser(request.payload);
        if (user) {
          return h.response(user).code(201);
        }
        return Boom.badImplementation("error creating user");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a user",
    notes: "Creates a user from the payload and returns the new user",
    validate: { payload: UserSpec, failAction: validationError },
    response: { schema: UserSpecPlus, failAction: validationError },
  },
  
  deleteOne: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserById(request.params.id);
        
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        
        await db.userStore.deleteUserById(user._id);
        return h.response().code(204);
        
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete a user",
    notes: "Deletes a user by id",
  },
  
  deleteAll: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        await db.userStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all users",
    notes: "Deletes all users from the database",
  },
  
  update: {
    handler: async function (request, h) {
      return { success: true };
    }
  }
};

// Collection API endpoints for CRUD operations on collections
// Each handler is called by the Hapi routes when the API endpoints are hit
// JWT auth protects the routes so only authenticated users can access the API
// Joi schemas validate incoming params/payloads and also document responses for Swagger
// Boom is used to return standard HTTP errors (404 not found, 400 bad request, 503 database error)