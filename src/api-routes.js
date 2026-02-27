import { userApi } from "./api/user-api.js";
import { collectionApi } from "./api/collection-api.js";
import { placemarkApi } from "./api/placemark-api.js";

export const apiRoutes = [

  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },

  
  { method: "POST", path: "/api/playlists", config: collectionApi.create },
  { method: "GET", path: "/api/playlists", config: collectionApi.find },
  { method: "GET", path: "/api/playlists/{id}", config: collectionApi.findOne },
  { method: "DELETE", path: "/api/playlists", config: collectionApi.deleteAll },
  { method: "DELETE", path: "/api/playlists/{id}", config: collectionApi.deleteOne },

  
  { method: "POST", path: "/api/playlists/{id}/tracks", config: placemarkApi.create },
  { method: "GET", path: "/api/tracks", config: placemarkApi.find },
  { method: "GET", path: "/api/tracks/{id}", config: placemarkApi.findOne },
  { method: "DELETE", path: "/api/tracks", config: placemarkApi.deleteAll },
  { method: "DELETE", path: "/api/tracks/{id}", config: placemarkApi.deleteOne },
];
