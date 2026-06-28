const fs = require('fs');
const path = require('path');

const docPath = path.join(__dirname, 'PROJECT_DOCUMENTATION.md');
let docContent = fs.readFileSync(docPath, 'utf8');

const apiDocContent = `## 4.3 API Documentation

### Auth Module

#### Endpoint
\`POST /api/auth/register\`
#### Purpose
Registers a new user in the system and issues an HTTP-only JWT cookie.
#### Authentication
None (Public)
#### Request Parameters
None
#### Request Body
\`\`\`json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`
#### Response (201 Created)
\`\`\`json
{
  "user": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"
  }
}
\`\`\`
#### Error Responses
- 409 Conflict: Email already exists
- 400 Bad Request: Validation failed (e.g. password too short)
#### Example Request
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","password":"password123"}'
\`\`\`
#### Example Response
\`\`\`json
{ "user": { "id": "123", "name": "Test", "email": "test@test.com", "role": "user" } }
\`\`\`

#### Endpoint
\`POST /api/auth/login\`
#### Purpose
Authenticates a user and issues an HTTP-only JWT cookie.
#### Authentication
None (Public)
#### Request Parameters
None
#### Request Body
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`
#### Response (200 OK)
\`\`\`json
{
  "user": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"
  }
}
\`\`\`
#### Error Responses
- 401 Unauthorized: Invalid credentials
- 400 Bad Request: Validation failed
#### Example Request
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"password123"}'
\`\`\`
#### Example Response
\`\`\`json
{ "user": { "id": "123", "name": "Test", "email": "test@test.com", "role": "user" } }
\`\`\`

#### Endpoint
\`POST /api/auth/logout\`
#### Purpose
Logs out the user by clearing the JWT cookie.
#### Authentication
None (Public)
#### Request Parameters
None
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{ "message": "Logged out successfully" }
\`\`\`
#### Error Responses
None
#### Example Request
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/logout
\`\`\`
#### Example Response
\`\`\`json
{ "message": "Logged out successfully" }
\`\`\`

#### Endpoint
\`GET /api/auth/me\`
#### Purpose
Retrieves the profile of the currently authenticated user.
#### Authentication
JWT Required
#### Request Parameters
None
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{
  "id": "uuid",
  "name": "User Name",
  "email": "user@example.com",
  "role": "user",
  "language": "en",
  "savedDestinations": "[]"
}
\`\`\`
#### Error Responses
- 401 Unauthorized: Invalid or missing token
#### Example Request
\`\`\`bash
curl -X GET http://localhost:3000/api/auth/me -H "Cookie: jwt=token"
\`\`\`
#### Example Response
\`\`\`json
{ "id": "123", "name": "Test", "email": "test@test.com", "role": "user" }
\`\`\`

#### Endpoint
\`POST /api/auth/forgot-password\`
#### Purpose
Initiates the password reset flow by generating a token.
#### Authentication
None (Public)
#### Request Parameters
None
#### Request Body
\`\`\`json
{ "email": "user@example.com" }
\`\`\`
#### Response (200 OK)
\`\`\`json
{ "message": "If an account exists, a reset link was sent" }
\`\`\`
#### Error Responses
- 429 Too Many Requests: Rate limit exceeded
#### Example Request
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/forgot-password -H "Content-Type: application/json" -d '{"email":"test@test.com"}'
\`\`\`
#### Example Response
\`\`\`json
{ "message": "If an account exists, a reset link was sent" }
\`\`\`

#### Endpoint
\`POST /api/auth/reset-password\`
#### Purpose
Resets the user's password using the provided reset token.
#### Authentication
None (Public)
#### Request Parameters
None
#### Request Body
\`\`\`json
{ "token": "reset-token", "newPassword": "newPassword123" }
\`\`\`
#### Response (200 OK)
\`\`\`json
{ "message": "Password reset successfully" }
\`\`\`
#### Error Responses
- 400 Bad Request: Invalid or expired token
#### Example Request
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/reset-password -H "Content-Type: application/json" -d '{"token":"123","newPassword":"abc"}'
\`\`\`
#### Example Response
\`\`\`json
{ "message": "Password reset successfully" }
\`\`\`

### Users Module

#### Endpoint
\`GET /api/users/verify-email\`
#### Purpose
Verifies a pending email change.
#### Authentication
None (Public)
#### Request Parameters
\`?token=string\`
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{ "message": "Email verified successfully", "email": "new@example.com" }
\`\`\`
#### Error Responses
- 400 Bad Request: Invalid or expired token
#### Example Request
\`\`\`bash
curl -X GET http://localhost:3000/api/users/verify-email?token=abc
\`\`\`
#### Example Response
\`\`\`json
{ "message": "Email verified successfully", "email": "new@example.com" }
\`\`\`

#### Endpoint
\`GET /api/users/profile\`
#### Purpose
Fetches the profile details of the authenticated user.
#### Authentication
JWT Required
#### Request Parameters
None
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{ "id": "uuid", "name": "User", "email": "user@example.com", "role": "user" }
\`\`\`
#### Error Responses
- 401 Unauthorized
#### Example Request
\`\`\`bash
curl -X GET http://localhost:3000/api/users/profile -H "Cookie: jwt=token"
\`\`\`
#### Example Response
\`\`\`json
{ "id": "uuid", "name": "User", "email": "user@example.com", "role": "user" }
\`\`\`

#### Endpoint
\`PUT /api/users/profile\`
#### Purpose
Updates the authenticated user's profile settings.
#### Authentication
JWT Required
#### Request Parameters
None
#### Request Body
\`\`\`json
{ "name": "New Name", "language": "en", "avatar": "emoji" }
\`\`\`
#### Response (200 OK)
\`\`\`json
{ "id": "uuid", "name": "New Name", "language": "en", "avatar": "emoji" }
\`\`\`
#### Error Responses
- 401 Unauthorized
#### Example Request
\`\`\`bash
curl -X PUT http://localhost:3000/api/users/profile -H "Cookie: jwt=token" -H "Content-Type: application/json" -d '{"name":"New Name"}'
\`\`\`
#### Example Response
\`\`\`json
{ "id": "uuid", "name": "New Name" }
\`\`\`

#### Endpoint
\`DELETE /api/users/account\`
#### Purpose
Permanently deletes the authenticated user's account and all associated data.
#### Authentication
JWT Required
#### Request Parameters
None
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{ "message": "Account deleted" }
\`\`\`
#### Error Responses
- 401 Unauthorized
#### Example Request
\`\`\`bash
curl -X DELETE http://localhost:3000/api/users/account -H "Cookie: jwt=token"
\`\`\`
#### Example Response
\`\`\`json
{ "message": "Account deleted" }
\`\`\`

### Trips Module

#### Endpoint
\`POST /api/trips\`
#### Purpose
Creates a new trip.
#### Authentication
JWT Required
#### Request Parameters
None
#### Request Body
\`\`\`json
{ "name": "My Trip", "description": "Trip to Goa", "startDate": "2026-06-15", "endDate": "2026-06-20", "status": "draft" }
\`\`\`
#### Response (201 Created)
\`\`\`json
{ "id": "uuid", "name": "My Trip", "startDate": "2026-06-15", "endDate": "2026-06-20", "status": "draft" }
\`\`\`
#### Error Responses
- 401 Unauthorized
- 400 Bad Request
#### Example Request
\`\`\`bash
curl -X POST http://localhost:3000/api/trips -H "Cookie: jwt=token" -d '{"name":"Goa"}'
\`\`\`
#### Example Response
\`\`\`json
{ "id": "uuid", "name": "Goa" }
\`\`\`

#### Endpoint
\`GET /api/trips\`
#### Purpose
Lists all trips belonging to the authenticated user.
#### Authentication
JWT Required
#### Request Parameters
\`?page=1&limit=10\`
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{ "data": [ { "id": "uuid", "name": "Trip" } ], "total": 1, "page": 1, "totalPages": 1 }
\`\`\`
#### Error Responses
- 401 Unauthorized
#### Example Request
\`\`\`bash
curl -X GET http://localhost:3000/api/trips?page=1 -H "Cookie: jwt=token"
\`\`\`
#### Example Response
\`\`\`json
{ "data": [], "total": 0, "page": 1, "totalPages": 0 }
\`\`\`

#### Endpoint
\`GET /api/trips/:id\`
#### Purpose
Fetches a single trip with its stops, activities, budgets, packing lists, and notes.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\` (Trip UUID)
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{ "id": "uuid", "name": "Trip", "stops": [], "budgetItems": [], "packingItems": [], "notes": [] }
\`\`\`
#### Error Responses
- 404 Not Found
- 403 Forbidden
#### Example Request
\`\`\`bash
curl -X GET http://localhost:3000/api/trips/123 -H "Cookie: jwt=token"
\`\`\`
#### Example Response
\`\`\`json
{ "id": "123", "name": "Trip", "stops": [] }
\`\`\`

#### Endpoint
\`PUT /api/trips/:id\`
#### Purpose
Updates trip details.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\` (Trip UUID)
#### Request Body
\`\`\`json
{ "name": "Updated Trip" }
\`\`\`
#### Response (200 OK)
\`\`\`json
{ "id": "uuid", "name": "Updated Trip" }
\`\`\`
#### Error Responses
- 404 Not Found
- 403 Forbidden
#### Example Request
\`\`\`bash
curl -X PUT http://localhost:3000/api/trips/123 -H "Cookie: jwt=token" -H "Content-Type: application/json" -d '{"name":"Updated Trip"}'
\`\`\`
#### Example Response
\`\`\`json
{ "id": "123", "name": "Updated Trip" }
\`\`\`

#### Endpoint
\`DELETE /api/trips/:id\`
#### Purpose
Deletes a trip and all its associated entities.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\` (Trip UUID)
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{ "message": "Trip deleted" }
\`\`\`
#### Error Responses
- 404 Not Found
- 403 Forbidden
#### Example Request
\`\`\`bash
curl -X DELETE http://localhost:3000/api/trips/123 -H "Cookie: jwt=token"
\`\`\`
#### Example Response
\`\`\`json
{ "message": "Trip deleted" }
\`\`\`

#### Endpoint
\`PATCH /api/trips/:id/share\`
#### Purpose
Toggles the public sharing status of a trip.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\` (Trip UUID)
#### Request Body
\`\`\`json
{ "isPublic": true }
\`\`\`
#### Response (200 OK)
\`\`\`json
{ "id": "uuid", "isPublic": true, "shareToken": "random-string", "shareExpiresAt": "date" }
\`\`\`
#### Error Responses
- 404 Not Found
- 403 Forbidden
#### Example Request
\`\`\`bash
curl -X PATCH http://localhost:3000/api/trips/123/share -H "Cookie: jwt=token" -H "Content-Type: application/json" -d '{"isPublic":true}'
\`\`\`
#### Example Response
\`\`\`json
{ "id": "123", "isPublic": true, "shareToken": "xyz" }
\`\`\`

### Trip Stops Module

#### Endpoint
\`POST /api/trips/:id/stops\`
#### Purpose
Adds a stop to the trip itinerary.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\` (Trip UUID)
#### Request Body
\`\`\`json
{ "cityName": "Goa", "cityId": "goa-1", "arrivalDate": "2026-06-15", "departureDate": "2026-06-18", "state": "Goa", "region": "West" }
\`\`\`
#### Response (201 Created)
\`\`\`json
{ "id": "uuid", "cityName": "Goa" }
\`\`\`
#### Error Responses
- 400 Bad Request: Dates out of range
- 404 Not Found
- 403 Forbidden
#### Example Request
\`\`\`bash
curl -X POST http://localhost:3000/api/trips/123/stops -H "Cookie: jwt=token" -H "Content-Type: application/json" -d '{"cityName":"Goa", "arrivalDate":"2026-06-15", "departureDate":"2026-06-18"}'
\`\`\`
#### Example Response
\`\`\`json
{ "id": "stop-1", "cityName": "Goa" }
\`\`\`

#### Endpoint
\`PUT /api/trips/:id/stops/:stopId\`
#### Purpose
Updates the arrival and departure dates of a stop.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\` (Trip UUID), \`stopId\` (Stop UUID)
#### Request Body
\`\`\`json
{ "arrivalDate": "2026-06-16", "departureDate": "2026-06-19" }
\`\`\`
#### Response (200 OK)
\`\`\`json
{ "id": "stop-1", "arrivalDate": "2026-06-16" }
\`\`\`
#### Error Responses
- 400 Bad Request
- 404 Not Found
#### Example Request
\`\`\`bash
curl -X PUT http://localhost:3000/api/trips/123/stops/456 -H "Cookie: jwt=token" -H "Content-Type: application/json" -d '{"arrivalDate":"2026-06-16"}'
\`\`\`
#### Example Response
\`\`\`json
{ "id": "456", "arrivalDate": "2026-06-16" }
\`\`\`

#### Endpoint
\`DELETE /api/trips/:id/stops/:stopId\`
#### Purpose
Removes a stop from the itinerary.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\` (Trip UUID), \`stopId\` (Stop UUID)
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{ "message": "Stop deleted" }
\`\`\`
#### Error Responses
- 404 Not Found
#### Example Request
\`\`\`bash
curl -X DELETE http://localhost:3000/api/trips/123/stops/456 -H "Cookie: jwt=token"
\`\`\`
#### Example Response
\`\`\`json
{ "message": "Stop deleted" }
\`\`\`

#### Endpoint
\`PATCH /api/trips/:id/stops/reorder\`
#### Purpose
Updates the order sequence of the itinerary stops.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\` (Trip UUID)
#### Request Body
\`\`\`json
{ "stopIds": ["stop-uuid-2", "stop-uuid-1"] }
\`\`\`
#### Response (200 OK)
\`\`\`json
{ "message": "Stops reordered" }
\`\`\`
#### Error Responses
- 404 Not Found
#### Example Request
\`\`\`bash
curl -X PATCH http://localhost:3000/api/trips/123/stops/reorder -H "Cookie: jwt=token" -H "Content-Type: application/json" -d '{"stopIds":["456", "789"]}'
\`\`\`
#### Example Response
\`\`\`json
{ "message": "Stops reordered" }
\`\`\`

#### Endpoint
\`POST /api/trips/:id/stops/:stopId/activities\`
#### Purpose
Associates an activity with an itinerary stop.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\` (Trip UUID), \`stopId\` (Stop UUID)
#### Request Body
\`\`\`json
{ "activityId": "act-123" }
\`\`\`
#### Response (201 Created)
\`\`\`json
{ "id": "uuid", "stopId": "stop-1", "activityId": "act-123" }
\`\`\`
#### Error Responses
- 404 Not Found
#### Example Request
\`\`\`bash
curl -X POST http://localhost:3000/api/trips/123/stops/456/activities -H "Cookie: jwt=token" -H "Content-Type: application/json" -d '{"activityId":"act-123"}'
\`\`\`
#### Example Response
\`\`\`json
{ "id": "uuid", "activityId": "act-123" }
\`\`\`

#### Endpoint
\`DELETE /api/trips/:id/stops/:stopId/activities/:activityId\`
#### Purpose
Removes an activity from a stop.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\`, \`stopId\`, \`activityId\`
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{ "message": "Activity removed from stop" }
\`\`\`
#### Error Responses
- 404 Not Found
#### Example Request
\`\`\`bash
curl -X DELETE http://localhost:3000/api/trips/123/stops/456/activities/act-123 -H "Cookie: jwt=token"
\`\`\`
#### Example Response
\`\`\`json
{ "message": "Activity removed from stop" }
\`\`\`

### Budget Module

#### Endpoint
\`GET /api/trips/:id/budget\`
#### Purpose
Fetches all budget items for a trip.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\`
#### Request Body
None
#### Response (200 OK)
\`\`\`json
[ { "id": "uuid", "category": "Meals", "label": "Dinner", "amount": 500 } ]
\`\`\`
#### Error Responses
- 404 Not Found
#### Example Request
\`\`\`bash
curl -X GET http://localhost:3000/api/trips/123/budget -H "Cookie: jwt=token"
\`\`\`
#### Example Response
\`\`\`json
[]
\`\`\`

#### Endpoint
\`POST /api/trips/:id/budget\`
#### Purpose
Adds a new budget expense to a trip.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\`
#### Request Body
\`\`\`json
{ "category": "Transport", "label": "Flight", "amount": 5000, "stopId": "optional-uuid" }
\`\`\`
#### Response (201 Created)
\`\`\`json
{ "id": "uuid", "category": "Transport", "label": "Flight", "amount": 5000 }
\`\`\`
#### Error Responses
- 404 Not Found
#### Example Request
\`\`\`bash
curl -X POST http://localhost:3000/api/trips/123/budget -H "Cookie: jwt=token" -H "Content-Type: application/json" -d '{"category":"Meals","label":"Lunch","amount":200}'
\`\`\`
#### Example Response
\`\`\`json
{ "id": "uuid", "category": "Meals", "label": "Lunch", "amount": 200 }
\`\`\`

#### Endpoint
\`DELETE /api/trips/:id/budget/:itemId\`
#### Purpose
Deletes a budget item.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\`, \`itemId\`
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{ "message": "Budget item deleted" }
\`\`\`
#### Error Responses
- 404 Not Found
#### Example Request
\`\`\`bash
curl -X DELETE http://localhost:3000/api/trips/123/budget/456 -H "Cookie: jwt=token"
\`\`\`
#### Example Response
\`\`\`json
{ "message": "Budget item deleted" }
\`\`\`

### Packing Module

#### Endpoint
\`GET /api/trips/:id/packing\`
#### Purpose
Fetches all packing list items for a trip.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\`
#### Request Body
None
#### Response (200 OK)
\`\`\`json
[ { "id": "uuid", "name": "Passport", "category": "Documents", "isPacked": false } ]
\`\`\`
#### Error Responses
- 404 Not Found
#### Example Request
\`\`\`bash
curl -X GET http://localhost:3000/api/trips/123/packing -H "Cookie: jwt=token"
\`\`\`
#### Example Response
\`\`\`json
[]
\`\`\`

#### Endpoint
\`POST /api/trips/:id/packing\`
#### Purpose
Adds an item to the packing checklist.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\`
#### Request Body
\`\`\`json
{ "name": "Passport", "category": "Documents" }
\`\`\`
#### Response (201 Created)
\`\`\`json
{ "id": "uuid", "name": "Passport", "category": "Documents", "isPacked": false }
\`\`\`
#### Error Responses
- 404 Not Found
#### Example Request
\`\`\`bash
curl -X POST http://localhost:3000/api/trips/123/packing -H "Cookie: jwt=token" -H "Content-Type: application/json" -d '{"name":"Passport"}'
\`\`\`
#### Example Response
\`\`\`json
{ "id": "uuid", "name": "Passport", "isPacked": false }
\`\`\`

#### Endpoint
\`PUT /api/trips/:id/packing/:itemId\`
#### Purpose
Updates a packing item's packed status.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\`, \`itemId\`
#### Request Body
\`\`\`json
{ "isPacked": true }
\`\`\`
#### Response (200 OK)
\`\`\`json
{ "id": "uuid", "name": "Passport", "isPacked": true }
\`\`\`
#### Error Responses
- 404 Not Found
#### Example Request
\`\`\`bash
curl -X PUT http://localhost:3000/api/trips/123/packing/456 -H "Cookie: jwt=token" -H "Content-Type: application/json" -d '{"isPacked":true}'
\`\`\`
#### Example Response
\`\`\`json
{ "id": "uuid", "name": "Passport", "isPacked": true }
\`\`\`

#### Endpoint
\`DELETE /api/trips/:id/packing/:itemId\`
#### Purpose
Deletes a packing list item.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\`, \`itemId\`
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{ "message": "Packing item deleted" }
\`\`\`
#### Error Responses
- 404 Not Found
#### Example Request
\`\`\`bash
curl -X DELETE http://localhost:3000/api/trips/123/packing/456 -H "Cookie: jwt=token"
\`\`\`
#### Example Response
\`\`\`json
{ "message": "Packing item deleted" }
\`\`\`

### Notes Module

#### Endpoint
\`GET /api/trips/:id/notes\`
#### Purpose
Fetches all journal notes for a trip.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\`
#### Request Body
None
#### Response (200 OK)
\`\`\`json
[ { "id": "uuid", "content": "Flight info", "stopId": null } ]
\`\`\`
#### Error Responses
- 404 Not Found
#### Example Request
\`\`\`bash
curl -X GET http://localhost:3000/api/trips/123/notes -H "Cookie: jwt=token"
\`\`\`
#### Example Response
\`\`\`json
[]
\`\`\`

#### Endpoint
\`POST /api/trips/:id/notes\`
#### Purpose
Adds a new note to a trip.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\`
#### Request Body
\`\`\`json
{ "content": "Flight info", "stopId": "optional", "stopName": "optional" }
\`\`\`
#### Response (201 Created)
\`\`\`json
{ "id": "uuid", "content": "Flight info" }
\`\`\`
#### Error Responses
- 404 Not Found
#### Example Request
\`\`\`bash
curl -X POST http://localhost:3000/api/trips/123/notes -H "Cookie: jwt=token" -H "Content-Type: application/json" -d '{"content":"Test Note"}'
\`\`\`
#### Example Response
\`\`\`json
{ "id": "uuid", "content": "Test Note" }
\`\`\`

#### Endpoint
\`PUT /api/trips/:id/notes/:noteId\`
#### Purpose
Updates a trip note's content.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\`, \`noteId\`
#### Request Body
\`\`\`json
{ "content": "Updated flight info" }
\`\`\`
#### Response (200 OK)
\`\`\`json
{ "id": "uuid", "content": "Updated flight info" }
\`\`\`
#### Error Responses
- 404 Not Found
#### Example Request
\`\`\`bash
curl -X PUT http://localhost:3000/api/trips/123/notes/456 -H "Cookie: jwt=token" -H "Content-Type: application/json" -d '{"content":"Updated Note"}'
\`\`\`
#### Example Response
\`\`\`json
{ "id": "uuid", "content": "Updated Note" }
\`\`\`

#### Endpoint
\`DELETE /api/trips/:id/notes/:noteId\`
#### Purpose
Deletes a trip note.
#### Authentication
JWT Required
#### Request Parameters
Path param: \`id\`, \`noteId\`
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{ "message": "Note deleted" }
\`\`\`
#### Error Responses
- 404 Not Found
#### Example Request
\`\`\`bash
curl -X DELETE http://localhost:3000/api/trips/123/notes/456 -H "Cookie: jwt=token"
\`\`\`
#### Example Response
\`\`\`json
{ "message": "Note deleted" }
\`\`\`

### Cities Catalog Module

#### Endpoint
\`GET /api/cities\`
#### Purpose
Queries the cached cities catalog.
#### Authentication
None (Public)
#### Request Parameters
\`?q=query&type=type&region=region&page=1&limit=20\`
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{ "data": [ { "id": "goa", "name": "Goa" } ], "total": 1, "page": 1, "totalPages": 1 }
\`\`\`
#### Error Responses
None
#### Example Request
\`\`\`bash
curl -X GET http://localhost:3000/api/cities?q=goa
\`\`\`
#### Example Response
\`\`\`json
{ "data": [{"id": "goa", "name": "Goa"}], "total": 1, "page": 1, "totalPages": 1 }
\`\`\`

#### Endpoint
\`GET /api/cities/types\`
#### Purpose
Retrieves city type categories.
#### Authentication
None (Public)
#### Request Parameters
None
#### Request Body
None
#### Response (200 OK)
\`\`\`json
[ "Hill station", "Beach", "Metro" ]
\`\`\`
#### Error Responses
None
#### Example Request
\`\`\`bash
curl -X GET http://localhost:3000/api/cities/types
\`\`\`
#### Example Response
\`\`\`json
[ "Hill station", "Beach" ]
\`\`\`

#### Endpoint
\`GET /api/cities/regions\`
#### Purpose
Retrieves region categories.
#### Authentication
None (Public)
#### Request Parameters
None
#### Request Body
None
#### Response (200 OK)
\`\`\`json
[ "North India", "South India" ]
\`\`\`
#### Error Responses
None
#### Example Request
\`\`\`bash
curl -X GET http://localhost:3000/api/cities/regions
\`\`\`
#### Example Response
\`\`\`json
[ "North India" ]
\`\`\`

### Activities Catalog Module

#### Endpoint
\`GET /api/activities\`
#### Purpose
Queries the activities catalog.
#### Authentication
None (Public)
#### Request Parameters
\`?city=cityId&category=cat&page=1&limit=20\`
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{ "data": [ { "id": "act-1", "name": "Scuba" } ], "total": 1, "page": 1, "totalPages": 1 }
\`\`\`
#### Error Responses
None
#### Example Request
\`\`\`bash
curl -X GET http://localhost:3000/api/activities
\`\`\`
#### Example Response
\`\`\`json
{ "data": [], "total": 0, "page": 1, "totalPages": 0 }
\`\`\`

#### Endpoint
\`GET /api/activities/categories\`
#### Purpose
Retrieves activity category classifications.
#### Authentication
None (Public)
#### Request Parameters
None
#### Request Body
None
#### Response (200 OK)
\`\`\`json
[ "Adventure", "Sightseeing" ]
\`\`\`
#### Error Responses
None
#### Example Request
\`\`\`bash
curl -X GET http://localhost:3000/api/activities/categories
\`\`\`
#### Example Response
\`\`\`json
[ "Adventure" ]
\`\`\`

### Shared Views Module

#### Endpoint
\`GET /api/shared/:token\`
#### Purpose
Public read-only itinerary fetch.
#### Authentication
None (Public)
#### Request Parameters
Path param: \`token\`
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{ "trip": { "name": "Trip", "stops": [] } }
\`\`\`
#### Error Responses
- 404 Not Found (or expired)
#### Example Request
\`\`\`bash
curl -X GET http://localhost:3000/api/shared/abc-123
\`\`\`
#### Example Response
\`\`\`json
{ "trip": { "name": "Goa Trip", "stops": [] } }
\`\`\`

### Admin Module

#### Endpoint
\`GET /api/admin/stats\`
#### Purpose
Fetches statistics and registration logs.
#### Authentication
JWT Required (Admin Role)
#### Request Parameters
None
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{ "totalTrips": 10, "sharedTrips": 2, "topCities": [], "totalUsers": 5, "users": [] }
\`\`\`
#### Error Responses
- 403 Forbidden
#### Example Request
\`\`\`bash
curl -X GET http://localhost:3000/api/admin/stats -H "Cookie: jwt=token"
\`\`\`
#### Example Response
\`\`\`json
{ "totalTrips": 10, "sharedTrips": 2, "topCities": [], "totalUsers": 5, "users": [] }
\`\`\`

#### Endpoint
\`POST /api/admin/cache/clear\`
#### Purpose
Clears the system catalog cache.
#### Authentication
JWT Required (Admin Role)
#### Request Parameters
None
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{ "message": "Cache cleared successfully" }
\`\`\`
#### Error Responses
- 403 Forbidden
#### Example Request
\`\`\`bash
curl -X POST http://localhost:3000/api/admin/cache/clear -H "Cookie: jwt=token"
\`\`\`
#### Example Response
\`\`\`json
{ "message": "Cache cleared successfully" }
\`\`\`

#### Endpoint
\`GET /api/admin/audit-logs\`
#### Purpose
Fetches paginated system action logs.
#### Authentication
JWT Required (Admin Role)
#### Request Parameters
\`?page=1&limit=20\`
#### Request Body
None
#### Response (200 OK)
\`\`\`json
{ "data": [ { "id": "uuid", "action": "CREATE_TRIP" } ], "total": 1, "page": 1, "totalPages": 1 }
\`\`\`
#### Error Responses
- 403 Forbidden
#### Example Request
\`\`\`bash
curl -X GET http://localhost:3000/api/admin/audit-logs -H "Cookie: jwt=token"
\`\`\`
#### Example Response
\`\`\`json
{ "data": [], "total": 0, "page": 1, "totalPages": 0 }
\`\`\`
`;

const tableDocContent = `## 5.3 Tables

### \`users\`
#### Columns
| Column | Type | Nullable | Default |
|----------|----------|----------|----------|
| \`id\` | \`uuid\` | No | Auto UUID |
| \`email\` | \`varchar\` | No | |
| \`name\` | \`varchar\` | No | |
| \`avatar\` | \`varchar\` | Yes | null |
| \`password\` | \`varchar\` | Yes | null |
| \`role\` | \`varchar\` | No | 'user' |
| \`language\` | \`varchar\` | Yes | null |
| \`pending_email\` | \`varchar\` | Yes | null |
| \`email_verify_token\` | \`varchar\` | Yes | null |
| \`email_verify_expires\` | \`datetime\` | Yes | null |
| \`savedDestinations\` | \`text\` | Yes | null |
| \`createdAt\` | \`datetime\` | No | now() |
| \`updatedAt\` | \`datetime\` | No | now() |
#### Indexes
- Unique index on \`email\`
#### Constraints
- None
#### Relationships
- One-to-Many with \`trips\`
- One-to-Many with \`password_reset_tokens\`
#### Purpose
Stores user account profiles, authentication hashes, and roles.

### \`password_reset_tokens\`
#### Columns
| Column | Type | Nullable | Default |
|----------|----------|----------|----------|
| \`id\` | \`uuid\` | No | Auto UUID |
| \`tokenHash\` | \`varchar\` | No | |
| \`expiresAt\` | \`datetime\` | No | |
| \`usedAt\` | \`datetime\` | Yes | null |
| \`userId\` | \`uuid\` | No | |
| \`createdAt\` | \`datetime\` | No | now() |
#### Indexes
- None
#### Constraints
- Foreign Key \`userId\` references \`users.id\` (ON DELETE CASCADE)
#### Relationships
- Many-to-One with \`users\`
#### Purpose
Tracks issued cryptographic tokens used for resetting forgotten passwords.

### \`trips\`
#### Columns
| Column | Type | Nullable | Default |
|----------|----------|----------|----------|
| \`id\` | \`uuid\` | No | Auto UUID |
| \`name\` | \`varchar\` | No | |
| \`description\` | \`text\` | Yes | null |
| \`startDate\` | \`date\` | No | |
| \`endDate\` | \`date\` | No | |
| \`coverPhoto\` | \`varchar\` | Yes | null |
| \`isPublic\` | \`boolean\` | No | false |
| \`shareToken\` | \`varchar\` | Yes | null |
| \`shareExpiresAt\` | \`datetime\` | Yes | null |
| \`status\` | \`varchar\` | No | 'draft' |
| \`userId\` | \`uuid\` | No | |
| \`createdAt\` | \`datetime\` | No | now() |
| \`updatedAt\` | \`datetime\` | No | now() |
#### Indexes
- Unique index on \`shareToken\`
#### Constraints
- Foreign Key \`userId\` references \`users.id\` (ON DELETE CASCADE)
#### Relationships
- Many-to-One with \`users\`
- One-to-Many with \`trip_stops\`, \`budget_items\`, \`packing_items\`, \`trip_notes\`
#### Purpose
Represents the core itinerary container that holds dates, sharing links, and associations to stops.

### \`trip_stops\`
#### Columns
| Column | Type | Nullable | Default |
|----------|----------|----------|----------|
| \`id\` | \`uuid\` | No | Auto UUID |
| \`cityName\` | \`varchar\` | No | |
| \`cityId\` | \`varchar\` | Yes | null |
| \`region\` | \`varchar\` | Yes | null |
| \`state\` | \`varchar\` | Yes | null |
| \`arrivalDate\` | \`date\` | No | |
| \`departureDate\` | \`date\` | No | |
| \`orderIndex\` | \`integer\` | No | 0 |
| \`tripId\` | \`uuid\` | No | |
| \`createdAt\` | \`datetime\` | No | now() |
| \`updatedAt\` | \`datetime\` | No | now() |
#### Indexes
- None
#### Constraints
- Foreign Key \`tripId\` references \`trips.id\` (ON DELETE CASCADE)
#### Relationships
- Many-to-One with \`trips\`
- One-to-Many with \`trip_stop_activities\`
#### Purpose
Records an individual city stop within an itinerary, defining chronological arrival/departure bounds.

### \`trip_stop_activities\`
#### Columns
| Column | Type | Nullable | Default |
|----------|----------|----------|----------|
| \`id\` | \`uuid\` | No | Auto UUID |
| \`stopId\` | \`uuid\` | No | |
| \`activityId\` | \`varchar\` | No | |
| \`addedAt\` | \`datetime\` | No | now() |
#### Indexes
- None
#### Constraints
- Foreign Key \`stopId\` references \`trip_stops.id\` (ON DELETE CASCADE)
- Foreign Key \`activityId\` references \`activities.id\` (ON DELETE CASCADE)
#### Relationships
- Many-to-One with \`trip_stops\`
- Many-to-One with \`activities\`
#### Purpose
Junction table linking specific activities to a particular trip stop.

### \`activities\`
#### Columns
| Column | Type | Nullable | Default |
|----------|----------|----------|----------|
| \`id\` | \`varchar\` | No | |
| \`name\` | \`varchar\` | No | |
| \`city\` | \`varchar\` | No | |
| \`category\` | \`varchar\` | No | |
| \`cost\` | \`integer\` | No | |
| \`duration\` | \`integer\` | No | |
| \`description\` | \`varchar\` | No | |
#### Indexes
- None
#### Constraints
- None
#### Relationships
- None (Catalog Data)
#### Purpose
Static catalog of local experiences and tours available in cities.

### \`cities\`
#### Columns
| Column | Type | Nullable | Default |
|----------|----------|----------|----------|
| \`id\` | \`varchar\` | No | |
| \`name\` | \`varchar\` | No | |
| \`state\` | \`varchar\` | No | |
| \`region\` | \`varchar\` | No | |
| \`type\` | \`varchar\` | No | |
| \`costIndex\` | \`varchar\` | No | |
| \`popularity\` | \`integer\` | No | |
| \`description\` | \`varchar\` | No | |
| \`image\` | \`varchar\` | No | |
#### Indexes
- None
#### Constraints
- None
#### Relationships
- None (Catalog Data)
#### Purpose
Static catalog of travel destinations.

### \`budget_items\`
#### Columns
| Column | Type | Nullable | Default |
|----------|----------|----------|----------|
| \`id\` | \`uuid\` | No | Auto UUID |
| \`category\` | \`varchar\` | No | |
| \`label\` | \`varchar\` | No | |
| \`amount\` | \`decimal\` | No | |
| \`stopId\` | \`uuid\` | Yes | null |
| \`tripId\` | \`uuid\` | No | |
| \`createdAt\` | \`datetime\` | No | now() |
#### Indexes
- None
#### Constraints
- Foreign Key \`tripId\` references \`trips.id\` (ON DELETE CASCADE)
- Foreign Key \`stopId\` references \`trip_stops.id\` (ON DELETE SET NULL)
#### Relationships
- Many-to-One with \`trips\` and \`trip_stops\`
#### Purpose
Logs specific monetary expenses tracked during a trip.

### \`packing_items\`
#### Columns
| Column | Type | Nullable | Default |
|----------|----------|----------|----------|
| \`id\` | \`uuid\` | No | Auto UUID |
| \`name\` | \`varchar\` | No | |
| \`category\` | \`varchar\` | No | 'general' |
| \`isPacked\` | \`boolean\` | No | false |
| \`tripId\` | \`uuid\` | No | |
| \`createdAt\` | \`datetime\` | No | now() |
#### Indexes
- None
#### Constraints
- Foreign Key \`tripId\` references \`trips.id\` (ON DELETE CASCADE)
#### Relationships
- Many-to-One with \`trips\`
#### Purpose
Checklist items indicating user's packing status.

### \`trip_notes\`
#### Columns
| Column | Type | Nullable | Default |
|----------|----------|----------|----------|
| \`id\` | \`uuid\` | No | Auto UUID |
| \`content\` | \`text\` | No | |
| \`stopId\` | \`uuid\` | Yes | null |
| \`stopName\` | \`varchar\` | Yes | null |
| \`tripId\` | \`uuid\` | No | |
| \`createdAt\` | \`datetime\` | No | now() |
| \`updatedAt\` | \`datetime\` | No | now() |
#### Indexes
- None
#### Constraints
- Foreign Key \`tripId\` references \`trips.id\` (ON DELETE CASCADE)
- Foreign Key \`stopId\` references \`trip_stops.id\` (ON DELETE SET NULL)
#### Relationships
- Many-to-One with \`trips\` and \`trip_stops\`
#### Purpose
Rich-text entries for travel journals or itinerary reminders.

### \`audit_logs\`
#### Columns
| Column | Type | Nullable | Default |
|----------|----------|----------|----------|
| \`id\` | \`uuid\` | No | Auto UUID |
| \`userId\` | \`varchar\` | No | |
| \`action\` | \`varchar\` | No | |
| \`entityType\` | \`varchar\` | No | |
| \`entityId\` | \`varchar\` | Yes | null |
| \`metadata\` | \`json\` | Yes | null |
| \`createdAt\` | \`datetime\` | No | now() |
#### Indexes
- None
#### Constraints
- None
#### Relationships
- None
#### Purpose
Tracks administrative actions, creations, and deletions for security and analytics.
`;

const updatedContent = docContent.replace(/## 4\.3 API Documentation[\s\S]*?(?=## 4\.4 Business Logic)/, apiDocContent + '\n\n')
                                 .replace(/## 5\.3 Tables[\s\S]*?(?=## 5\.4 Data Flow)/, tableDocContent + '\n\n');

fs.writeFileSync(docPath, updatedContent);
console.log('Documentation expanded successfully!');
