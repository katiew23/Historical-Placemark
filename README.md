# Historical Placemark

A full-stack web application for storing and managing historical locations.

## Overview

Historical Placemark allows users to create collections of historical locations and store detailed placemark information including:

- Name
- Description
- Latitude and Longitude
- Category
- Year Established
- County

Each placemark belongs to a collection and can be created, viewed, or deleted via the API.

## Technologies Used

- Node.js
- Hapi.js
- Joi validation
- Swagger API documentation
- JSON persistence
- Mocha and Chai testing
- Bulma CSS framework

## Features

- User authentication
- Create and manage collections
- Add and remove placemarks
- REST API with validation
- Swagger API documentation
- Automated unit and API tests

## API Testing

All API and model tests are implemented using Mocha and Chai.

Current test status:
38 passing 
0 failing 

## Project Structure

## Project Structure
src/
api/
controllers/
models/
views/
test/


## Running the Project

Install dependencies:


npm install


Run the application:


npm start


Run tests:


npm run test


## Author

Kate Williams
# Placemark App

This repository contains coursework for the Full Stack Development module. It demonstrates the progressive development of a server-rendered web application using Node.js, Hapi, and Handlebars following an MVC structure.

The project has been updated to reflect the assignment requirements using **Collections** and **Placemarks**.

---

## Core MVC and Authentication

### Features
- User authentication (sign up, log in, log out)
- Dashboard view for logged-in users
- About page with active navigation highlighting
- Collections management (add and list collections)
- Session-based authentication
- Handlebars layouts and partials
- Clear separation of routes, controllers, models/stores, and views

---

## Collections and Placemarks

Exercise 2 extends the project by adding placemark functionality and expanding the MVC flow through additional controllers, views, and stores.

### Features
- Add and list **placemarks** within a collection
- Collection page/view to display a single collection and its placemarks
- Handlebars partials for placemark UI (add + list)
- In-memory / JSON data store to manage placemarks
- Controllers updated to support collection/placemark interactions

### Architecture Notes
The project continues to follow MVC:
- **Routes** define endpoints and map requests
- **Controllers** handle request logic and select views
- **Models/Stores** manage data storage and retrieval
- **Views** render server-side using Handlebars templates and partials

---

## Tech Stack
- Node.js
- Hapi.js
- Handlebars (Vision)
- Bulma CSS
- JSON data store
- Git & GitHub

---

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the application:
   ```bash
   npm run start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Project Status

This version reflects the updated assignment structure using:
- Collections instead of playlists
- Placemarks instead of tracks
- JSON-based data storage

.
