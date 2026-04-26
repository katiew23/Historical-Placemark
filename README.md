Historical Placemark

Historical Placemark is a full-stack Node.js web application and REST API for storing and managing historical locations. Users can create collections of historical places and store detailed placemark information including geographic coordinates, descriptions, and images.

The project includes authentication, API endpoints, automated testing, and cloud deployment.

Overview

The system allows authenticated users to organise historical locations into collections and store detailed information about each placemark.

Each placemark belongs to a collection and contains structured data describing the location.

Placemark attributes include:

Name

Description

Latitude

Longitude

Category

Year Established

County

Image

The application includes both a web interface and a fully documented REST API.

Technologies Used

Node.js

Hapi.js

Handlebars

Bulma CSS

Joi validation

JWT authentication

Cookie authentication

Swagger / OpenAPI documentation

MongoDB with Mongoose

Firebase store implementation

Mocha and Chai testing

Axios API client

Amazon EC2 deployment

Accounts

The application supports full user account management.

Features include:

User signup

User login and logout

Cookie-based authentication for web routes

JWT authentication for API endpoints

Admin account functionality

Admin features include:

View all users

Remove users

Access admin dashboard

View system analytics including user, collection, and placemark counts

Placemark Features

Users can organise historical locations into collections and manage placemarks.

Placemark functionality includes:

Creating collections

Viewing collections

Deleting collections

Adding placemarks to collections

Viewing placemarks within collections

Deleting placemarks

Each placemark stores detailed information including geographic coordinates and descriptive metadata.

Images can also be uploaded and associated with collections.

API and Testing

The project exposes a fully documented REST API.

API capabilities include:

User authentication

Collection management

Placemark management

Secure endpoints protected by JWT

Swagger documentation provides an interactive interface for testing API endpoints.

Swagger documentation is available at:

http://localhost:3000/documentation
Automated Testing

Automated tests are implemented using Mocha and Chai.

The project includes tests for:

Authentication API

User API

Collection API

Placemark API

Admin API functionality

Firebase store functionality

Model unit tests

Error handling

Current test status:

50 passing
0 failing

Tests can be executed using:

npm test
Models and Data Stores

The project implements a flexible store architecture allowing controllers to work with different storage backends.

Implemented stores include:

Memory Stores

Used for early development and testing.

user-mem-store.js

collection-mem-store.js

placemark-mem-store.js

JSON Stores

Used for file-based persistence with LowDB.

user-json-store.js

collection-json-store.js

placemark-json-store.js

Mongo Stores

Used for persistent database storage.

user-mongo-store.js

collection-mongo-store.js

placemark-mongo-store.js

Firebase Stores

Additional store implementations for extended functionality.

firebase-collection-store.js

firebase-placemark-store.js

The application selects the appropriate store through the central db.js configuration.

Deployment

The application supports cloud deployment using Amazon EC2.

Deployment includes:

Launching an EC2 instance

Installing project dependencies

Configuring environment variables

Running the Node.js server

MongoDB Atlas is used for cloud database hosting.

Git Workflow

Version control is managed using Git.

Project repository includes:

Full commit history

Tagged releases

Git Flow branching strategy

Project Structure
src/
  api/
    collection-api.js
    placemark-api.js
    user-api.js
    jwt-utils.js

  controllers/
    about-controller.js
    accounts-controller.js
    admin-controller.js
    collection-controller.js
    dashboard-controller.js

  models/
    mem/
    json/
    mongo/
    firebase/
    db.js
    joi-schemas.js

  views/
    layouts/
    partials/

  server.js
  web-routes.js
  api-routes.js

test/
  api/
  models/
Running the Project

Install dependencies:

npm install

Start the application:

npm start

The server will run at:

Local development:
http://localhost:3000

AWS:
http://13.60.8.59:3000

Deployment:
http://98.81.246.63:3000

Run the full automated test suite:

Local development:
http://localhost:3000

npm test
Author

Kate Williams
Higher Diploma in Computer Science
Full Stack Development Module