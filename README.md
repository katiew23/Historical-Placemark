Historical Placemark API

A Node.js REST API for storing and managing historical locations organised into collections.
Users can authenticate, create collections, and add placemarks containing geographic coordinates and descriptive information.

Overview

Historical Placemark allows authenticated users to organise historical locations into collections and manage detailed placemark information.

Each placemark contains structured data describing a historical location and belongs to a specific collection.

Placemark attributes include:

Name

Description

Latitude

Longitude

Category

Year Established

County

The system exposes a fully documented REST API and includes automated tests for both the API layer and the underlying models.

Technologies Used

Node.js

Hapi.js

Joi validation

JWT authentication

Swagger API documentation

JSON data persistence

Mocha & Chai testing framework

Axios (API test client)

Key Features
Authentication

User registration

User authentication using JWT

Protected API routes

Collections

Create collections

Retrieve collections

Delete collections

Placemarks

Add placemarks to collections

Retrieve placemarks

Delete placemarks

Validation

Request validation using Joi schemas

Proper HTTP status responses for invalid data

API Documentation

Interactive Swagger documentation available for all endpoints

Automated Testing

Full API test coverage

Model unit tests

Authentication tests

Error handling tests

API Documentation

Swagger documentation is available when the server is running:

http://localhost:3000/documentation

This provides an interactive interface to explore and test all API endpoints.

Automated Testing

All API and model tests are implemented using Mocha and Chai.

Test suites include:

Authentication API tests

Collection API tests

Placemark API tests

User API tests

Collection model tests

Placemark model tests

User model tests

Current test status:

41 passing
0 failing

Run tests with:

npm test
Project Structure
src/
  api/
    collection-api.js
    placemark-api.js
    user-api.js
    jwt-utils.js

  models/
    json/
    mongo/
    joi-schemas.js

  server.js
  api-routes.js

test/
  api/
    auth-api-test.js
    collection-api-test.js
    placemark-api-test.js
    user-api-test.js
    placemark-service.js
Running the Project
Install dependencies
npm install
Start the server
npm start

The server will run at:

http://localhost:3000
Running Tests

Run the automated test suite:

npm test
Author

Kate Williams
Higher Diploma in Computer Science
Full Stack Development Module

Repository

GitHub repository for this assignment:

Historical-Placemark