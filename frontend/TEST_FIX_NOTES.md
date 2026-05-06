# Placemark API Test Fix Notes

## Problem
The Placemark API tests started failing after image upload functionality was added to the placemark create route.

The failing tests returned HTTP 500 errors instead of the expected 400/404 responses.

## Root Cause
A custom `onPreResponse` block in `server.js` was manually setting CORS headers using:

request.response.header(...)

This caused runtime errors in newer Hapi versions because `request.response.header` is not a valid function on all response objects.

The error generated internal server errors during API test execution.

## Additional Changes
The placemark API tests were updated to support multipart/form-data uploads by:
- using FormData in `placemark-service.js`
- attaching a test image using `fs.createReadStream()`
- increasing the Mocha timeout for upload tests

## Final Fix
The manual `onPreResponse` CORS block was removed because CORS was already correctly configured in the Hapi server routes configuration.

After removing the duplicate header handling:
- all API tests passed
- image uploads worked correctly
- frontend requests still functioned normally

## Result
46 tests passing successfully.