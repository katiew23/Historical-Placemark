import axios from "axios";
import { serviceUrl } from "../fixtures.js";
import FormData from "form-data";
import fs from "fs";

export const placemarkService = {
  serviceUrl: serviceUrl,
  
  async authenticate(user) {
    const response = await axios.post(`${this.serviceUrl}/api/users/authenticate`, user);
    axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
    return response.data;
  },
  
  async clearAuth() {
    axios.defaults.headers.common["Authorization"] = "";
  },
  
  async createUser(user) {
    const res = await axios.post(`${this.serviceUrl}/api/users`, user);
    return res.data;
  },
  
  async getUser(id) {
    const res = await axios.get(`${this.serviceUrl}/api/users/${id}`);
    return res.data;
  },
  
  async getAllUsers() {
    const res = await axios.get(`${this.serviceUrl}/api/users`);
    return res.data;
  },
  
  async deleteAllUsers() {
    const res = await axios.delete(`${this.serviceUrl}/api/users`);
    return res.data;
  },
  
  async createCollection(collection) {
    const res = await axios.post(`${this.serviceUrl}/api/collections`, collection);
    return res.data;
  },
  
  async getAllCollections() {
    const res = await axios.get(`${this.serviceUrl}/api/collections`);
    return res.data;
  },
  
  async getCollection(id) {
    const res = await axios.get(`${this.serviceUrl}/api/collections/${id}`);
    return res.data;
  },
  
  async deleteAllCollections() {
    const res = await axios.delete(`${this.serviceUrl}/api/collections`);
    return res.data;
  },
  
  async deleteCollection(id) {
    const res = await axios.delete(`${this.serviceUrl}/api/collections/${id}`);
    return res.data;
  },
  
  //async createPlacemark(collectionId, placemark) {    
   // const formData = new FormData();    
    //formData.append("name", placemark.name);
   // formData.append("description", placemark.description);
   // formData.append("latitude", placemark.latitude);
   // formData.append("longitude", placemark.longitude);
   // formData.append("category", placemark.category);
   // formData.append("yearEstablished", placemark.yearEstablished);
   // formData.append("county", placemark.county);    
   // formData.append(
    //  "imagefile",
    //  fs.createReadStream("./frontend/static/images/reginalds.jpg")
   // );    
    //const res = await axios.post(
    //  `${this.serviceUrl}/api/collections/${collectionId}/placemarks`,
    //  formData,
    //  {
    //    headers: formData.getHeaders()
    //  }
    //);
    //return res.data;
  //},

  async createPlacemark(collectionId, placemark) {

  const formData = new FormData();

  if (placemark.name) {
    formData.append("name", placemark.name);
  }

  if (placemark.description) {
    formData.append("description", placemark.description);
  }

  if (placemark.latitude) {
    formData.append("latitude", placemark.latitude);
  }

  if (placemark.longitude) {
    formData.append("longitude", placemark.longitude);
  }

  if (placemark.category) {
    formData.append("category", placemark.category);
  }

  if (placemark.yearEstablished) {
    formData.append("yearEstablished", placemark.yearEstablished);
  }

  if (placemark.county) {
    formData.append("county", placemark.county);
  }

  if (placemark.name) {
    formData.append(
      "imagefile",
      fs.createReadStream("./frontend/static/images/reginalds.jpg")
    );
  }

  const res = await axios.post(
    `${this.serviceUrl}/api/collections/${collectionId}/placemarks`,
    formData,
    {
      headers: formData.getHeaders()
    }
  );

  return res.data;
},

  async getAllPlacemarks() {
    const res = await axios.get(`${this.serviceUrl}/api/placemarks`);
    return res.data;
  },
  
  async getPlacemark(id) {
    const res = await axios.get(`${this.serviceUrl}/api/placemarks/${id}`);
    return res.data;
  },
  
  async deletePlacemark(id) {
    const res = await axios.delete(`${this.serviceUrl}/api/placemarks/${id}`);
    return res.data;
  },
  
  async deleteAllPlacemarks() {
    const res = await axios.delete(`${this.serviceUrl}/api/placemarks`);
    return res.data;
  },
};