import { userApi } from "./api/user-api.js";
import { collectionApi } from "./api/collection-api.js";
import { placemarkApi } from "./api/placemark-api.js";

export const apiRoutes = [

  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },
  { method: "PUT", path: "/api/users/{id}", config: userApi.update },
  { method: "DELETE", path: "/api/users/{id}", config: userApi.deleteOne },

  { method: "POST", path: "/api/collections", config: collectionApi.create },
  { method: "GET", path: "/api/collections", config: collectionApi.find },
  { method: "GET", path: "/api/collections/{id}", config: collectionApi.findOne },
  { method: "DELETE", path: "/api/collections", config: collectionApi.deleteAll },
  { method: "DELETE", path: "/api/collections/{id}", config: collectionApi.deleteOne },

  { method: "POST", path: "/api/collections/{id}/placemarks", config: placemarkApi.create },
  { method: "GET", path: "/api/placemarks", config: placemarkApi.find },
  { method: "GET", path: "/api/placemarks/{id}", config: placemarkApi.findOne },
  { method: "DELETE", path: "/api/placemarks", config: placemarkApi.deleteAll },
  { method: "DELETE", path: "/api/placemarks/{id}", config: placemarkApi.deleteOne },
  { method: "PUT", path: "/api/placemarks/{id}", config: placemarkApi.update },
  { method: "POST", path: "/api/upload", config: placemarkApi.uploadImage },
  
];
