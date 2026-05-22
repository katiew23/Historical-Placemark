# Historical Placemark – SvelteKit Frontend

Historical Placemark is a SvelteKit web application for exploring and managing historical places across Ireland. The app allows users to create collections, add placemarks, upload images, leave reviews, view analytics, and explore placemark locations using interactive maps.

This project was developed for the PlacemarkSvelteKit option of Assignment 2, focusing on modern frontend development, user experience, mapping features, charting components, images, and server-side SvelteKit functionality.

---

## Features

### User Features

- User signup and login
- Server-side cookie session handling
- Protected dashboard for logged-in users
- Create, edit, and delete collections
- Create, edit, and delete placemarks
- Upload placemark images using Cloudinary
- View placemark detail pages
- Add, edit, and delete reviews
- Review ownership checks so users can only edit/delete their own reviews

---

## Mapping Features

The application uses Leaflet maps to display placemark locations.

### Collection Map

- Displays placemarks in a selected collection
- Shows custom map markers
- Allows the user to click the map to populate latitude and longitude fields
- Includes OpenStreetMap base layer
- Includes OpenWeatherMap temperature and cloud map layers

### Admin Map

- Displays all placemarks across the application
- Includes weather information in placemark popups
- Supports admin-level overview of placemark locations

---

## Weather Forecast Trend

The placemark detail page includes a Weather Forecast Trend chart.

This chart uses the placemark’s latitude and longitude to fetch forecast data from OpenWeatherMap and displays projected temperature changes for that location.

This supports the analytics requirement for trends and projections while also fitting the purpose of the app, as users can view expected weather conditions before visiting a historical place.

---

## Analytics

The admin dashboard includes multiple chart types using Frappe Charts:

- Platform overview chart
- Placemarks by category
- Users by role
- Placemarks by county
- Weather forecast trend on placemark detail pages

---

## Admin Dashboard

The admin dashboard provides:

- Total user count
- Total collection count
- Total placemark count
- User table
- Collection table
- Placemark table
- Delete functionality for users, collections, and placemarks
- Analytics charts
- Admin placemark map

---

## Technology Stack

- SvelteKit
- TypeScript
- Svelte 5 runes
- Bulma CSS
- MongoDB Atlas
- Mongoose
- Cloudinary
- Leaflet
- OpenStreetMap
- OpenWeatherMap
- Frappe Charts
- Netlify

---

## Project Structure

src  
├── lib  
│   ├── assets  
│   ├── models  
│   │   ├── mongo  
│   │   │   ├── collection.ts  
│   │   │   ├── collection-store.ts  
│   │   │   ├── placemark.ts  
│   │   │   ├── placemark-store.ts  
│   │   │   ├── user.ts  
│   │   │   └── user-store.ts  
│   │   ├── db.ts  
│   │   └── image-store.ts  
│   ├── services  
│   │   ├── admin-service.ts  
│   │   ├── collection-service.ts  
│   │   ├── placemark-service.ts  
│   │   └── user-service.ts  
│   ├── ui  
│   │   ├── AddCollectionForm.svelte  
│   │   ├── AddPlacemarkForm.svelte  
│   │   ├── AdminCharts.svelte  
│   │   ├── CollectionCard.svelte  
│   │   ├── CollectionTable.svelte  
│   │   ├── PlacemarkCard.svelte  
│   │   ├── PlacemarkTable.svelte  
│   │   ├── ReviewCard.svelte  
│   │   ├── UserTable.svelte  
│   │   └── WeatherForecastChart.svelte  
│   └── runes.svelte.ts  
├── routes  
│   ├── admin  
│   ├── collection/[id]  
│   ├── dashboard  
│   ├── login  
│   ├── logout  
│   ├── placemark/[id]  
│   ├── signup  
│   ├── +layout.server.ts  
│   ├── +layout.svelte  
│   └── +page.svelte  
└── hooks.server.ts  

---

## Server-Side Data Flow

The app uses SvelteKit server-side load functions and actions.

Example flow:

+page.svelte  
→ user interaction  
→ fetch("?/actionName")  
→ +page.server.ts  
→ service layer  
→ Mongo store  
→ MongoDB / Cloudinary  

The main layers are:

| Layer | Purpose |
|---|---|
| +page.svelte | UI, forms, buttons, page display |
| +page.server.ts | Server-side loading and form actions |
| services | Application/business logic |
| mongo stores | Direct MongoDB queries |
| models | Mongoose schemas |
| image-store.ts | Cloudinary image upload/delete logic |

---

## Environment Variables

The following environment variables are required:

MONGO_URL=your_mongodb_atlas_connection_string

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name  
CLOUDINARY_API_KEY=your_cloudinary_api_key  
CLOUDINARY_API_SECRET=your_cloudinary_api_secret  

These should be added locally in `.env` and also configured in Netlify environment variables.

---

## Running Locally

Install dependencies:

npm install

Run the development server:

npm run dev

Open the app at:

http://localhost:5173

---

## Build

To check the production build:

npm run build

To preview the production build locally:

npm run preview

---

## Deployment

The frontend is designed to be deployed to Netlify.

Deployment requirements:

- Add all required environment variables in Netlify
- Ensure MongoDB Atlas allows the deployed environment to connect
- Ensure Cloudinary credentials are configured
- Run a final test of login, dashboard, maps, charts, image upload, reviews, and admin dashboard after deployment

---

## Key Assignment Features

| Rubric Area | Implementation |
|---|---|
| Analytics | Multiple Frappe charts and weather forecast trend chart |
| Maps | Leaflet maps on collection and admin pages with weather layers and weather popups |
| Images | Cloudinary image uploads and multiple images per placemark |
| Authentication | Signup, login, protected routes, server-side cookie session |
| Architecture | SvelteKit, TypeScript, server-side actions, MongoDB stores, reusable UI components |

---

## Notes

This project builds on the original Historical Placemark concept and extends it using SvelteKit, TypeScript, MongoDB, Cloudinary, mapping, charting, and weather-based analytics.

The application demonstrates full user interaction with collections, placemarks, images, reviews, admin management, maps, and forecast-based trend visualisation.

## Use of AI Tools

I used GitHub Copilot and Claude built into vscode as support tools during development. They were used to help with TypeScript syntax, code formatting, debugging warnings, README structure, and understanding SvelteKit/MongoDB integration.

All code was reviewed, tested, and adapted by me to fit the requirements of this project. 