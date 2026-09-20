# Youtube-Twitter-Clone

## Overview

`Youtube-Twitter-Clone` is an Express/Mongoose backend for a video-sharing and short-text social application. The current codebase exposes API routes for users, videos, comments, tweets, likes, playlists, subscriptions, health checks, and a dashboard placeholder. Uploaded media is written to `public/temp` by Multer and uploaded to Cloudinary before media URLs are stored in MongoDB.

The repository is an in-progress implementation: several controllers and route modules contain unresolved imports or runtime defects, and the project currently has no passing test script. The documentation below describes the routes, models, configuration, and behavior that are present in the source code without implying that every route is currently production-ready.

## Features

Implemented or represented in the current source:

- User registration and login flows.
- Access-token and refresh-token cookie handling.
- Password hashing with `bcrypt` in the user model.
- Protected routes using JWT verification middleware.
- User profile, account-detail, avatar, cover-image, and watch-history operations.
- Video publishing with video-file and thumbnail uploads.
- Cloudinary uploads for media files.
- Video listing, lookup, metadata updates, file/thumbnail replacement, and publish-status toggling.
- Comments associated with videos.
- Tweets associated with users.
- Toggle likes for videos, comments, and tweets.
- Playlists containing video references.
- Channel subscriptions.
- A database-backed health-check response.
- Central 404 and Express error middleware.

## Tech Stack

- **Runtime:** Node.js with ECMAScript modules.
- **Framework:** Express 5.
- **Database:** MongoDB through Mongoose.
- **Authentication:** JSON Web Tokens with `jsonwebtoken`, stored in HTTP-only cookies by the login and refresh flows.
- **Password hashing:** `bcrypt`.
- **Uploads:** `multer` using disk storage in `public/temp`.
- **Media storage:** Cloudinary through the `cloudinary` SDK.
- **Request logging:** `morgan`.
- **Configuration:** `dotenv`.
- **Pagination plugin:** `mongoose-aggregate-paginate-v2` is attached to the video schema, although no paginated endpoint is implemented in the current controllers.

## Project Structure

```text
.
├── server.js                         Application entry point
├── package.json                      npm metadata and scripts
├── package-lock.json                 Locked dependency versions
├── public/
│   └── temp/                         Local Multer upload destination
└── src/
    ├── app.js                        Express app, middleware, route mounting
    ├── config/
    │   ├── db.js                     MongoDB connection
    │   ├── env.js                    Required environment configuration
    │   └── generateToken.js           Access/refresh token helpers
    ├── controllers/                  Route handlers
    ├── helpers/
    │   ├── ApiError.js               Custom error class
    │   ├── ApiResponse.js             Success response wrapper
    │   └── asyncHandler.js            Async controller wrapper
    ├── middlewares/
    │   ├── auth.middleware.js         JWT-protection middleware
    │   ├── errorHandler.middleware.js 404 and error responses
    │   └── multer.middleware.js       Disk upload configuration
    ├── models/                        Mongoose schemas and models
    ├── routes/                        Express routers
    └── utils/
        └── cloudinary.service.js      Cloudinary upload helper
```

The request flow is mounted in `src/app.js`: common Express middleware runs first, then `/api/v1/*` routers dispatch to controllers. Controllers use Mongoose models and shared response/error helpers. `server.js` loads configuration, connects to MongoDB, and starts the HTTP server.

## Prerequisites

- Node.js with npm.
- A reachable MongoDB deployment and connection URI.
- Cloudinary credentials configured for the media-upload service used by `src/utils/cloudinary.service.js`.
- A writable `public/temp` directory for temporary uploads.

The repository does not declare a Node.js engine version, so use a current Node.js version compatible with the installed Express, Mongoose, and other dependency versions.

## Installation

```bash
git clone https://github.com/Animal-gits/Youtube-Twitter-Clone.git
cd Youtube-Twitter-Clone
npm install
```

Create a `.env` file in the repository root. The application exits during configuration loading if any required variable is missing:

```dotenv
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<your JWT secret>
PORT=<port number>
ACCESS_TOKEN_SECRET=<your access-token secret>
ACCESS_TOKEN_EXPIRY=<access-token expiry>
REFRESH_TOKEN_SECRET=<your refresh-token secret>
REFRESH_TOKEN_EXPIRY=<refresh-token expiry>
NODE_ENV=<development-or-production>
```

Do not commit `.env` files or secret values. `.env`, `.env.test`, and `.env.production` are ignored by Git.

## Environment Variables

`src/config/env.js` requires the following names:

| Variable | Usage |
|---|---|
| `MONGO_URI` | MongoDB connection URI passed to Mongoose. |
| `JWT_SECRET` | Required by configuration, but no current token-generation code uses it directly. |
| `PORT` | HTTP port passed to `app.listen`. |
| `ACCESS_TOKEN_SECRET` | Secret used to sign and verify access tokens. |
| `ACCESS_TOKEN_EXPIRY` | Access-token expiration passed to JWT signing. |
| `REFRESH_TOKEN_SECRET` | Intended refresh-token signing/verifying secret. |
| `REFRESH_TOKEN_EXPIRY` | Intended refresh-token expiration. |
| `NODE_ENV` | Controls production error-message and stack-trace behavior. |

The current `env.js` object assigns `REFRESH_TOKEN_SECRET` from `process.env.ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_EXPIRY` from `process.env.ACCESS_TOKEN_EXPIRY`. This differs from the validation checks and should be reviewed before deployment.

Cloudinary configuration is currently hard-coded in `src/utils/cloudinary.service.js` rather than read from environment variables. Do not add or reuse those credentials; rotate them and move them to secure configuration before operating the service publicly.

## Running the Project

The only development script declared in `package.json` is:

```bash
npm run dev
```

It runs `npx nodemon server.js`. There is no separate production npm script. The package declares a `test` script, but it intentionally exits with `Error: no test specified` and is not a test suite.

A direct start command is available through Node's module support:

```bash
node server.js
```

`server.js` connects to MongoDB and then listens on the configured `PORT`. Its startup callback currently logs port `3000` regardless of the configured value.

## API Documentation

The base URL is:

```text
/api/v1
```

All routes except the health check and the two user authentication routes are declared with the `protect` middleware or, for dashboard routes, the currently referenced `verifyJWT` middleware. Authentication is cookie-oriented: protected handlers expect an `accessToken` cookie; the middleware also attempts to support an Authorization header.

### Health

| Method | Route | Auth | Purpose | Request / response |
|---|---|---|---|---|
| `POST` | `/api/v1/health/` | No | Reports process uptime and MongoDB connection state. | Returns `status`, `database`, `timestamp`, and `uptime`; status is `200` when connected and `503` otherwise. |

### Users

| Method | Route | Auth | Purpose | Request / response |
|---|---|---|---|---|
| `POST` | `/api/v1/users/register` | No | Registers a user. | Multipart fields include `fullName`, `email`, `username`, `password`, required `avatar`, and optional `coverImage`. |
| `POST` | `/api/v1/users/login` | No | Authenticates a user. | Body accepts `username`, `email`, and `password`; attempts to set `accessToken` and `refreshToken` HTTP-only cookies. |
| `POST` | `/api/v1/users/refresh_token` | No | Refreshes access and refresh tokens. | Reads `refreshToken` from a cookie or request body. |
| `POST` | `/api/v1/users/logout` | Yes | Removes the stored refresh token and clears token cookies. | Returns the logged-out user when successful. |
| `POST` | `/api/v1/users/change_password` | Yes | Changes the current user's password. | Body: `oldPassword`, `newPassword`. |
| `GET` | `/api/v1/users/get_current_user` | Yes | Returns `req.user`. | No body. |
| `PATCH` | `/api/v1/users/update_details` | Yes | Updates account details. | Body is intended to contain `fullName` and `email`. |
| `PATCH` | `/api/v1/users/update_avatar` | Yes | Uploads a replacement avatar. | Multipart field: `avatar`. |
| `PATCH` | `/api/v1/users/update_cover` | Yes | Uploads a replacement cover image. | Multipart field: `coverImage`. |
| `GET` | `/api/v1/users/c/:username` | Yes | Retrieves an aggregated channel profile. | Path parameter: `username`; response includes profile and subscription-count fields when the aggregation succeeds. |
| `GET` | `/api/v1/users/watch_history` | Yes | Retrieves the current user's watch history aggregation. | No body. |

### Videos

| Method | Route | Auth | Purpose | Request / response |
|---|---|---|---|---|
| `POST` | `/api/v1/videos/publish` | Yes | Creates a video record after uploading media. | Multipart fields: `videoFile` and `thumbnail` (one each); body includes `title` and `description`. |
| `GET` | `/api/v1/videos/get_all` | Yes | Lists videos sorted newest first. | No body; returns `Video` documents. |
| `GET` | `/api/v1/videos/get_by_id/:videoId` | Yes | Fetches one video. | Path parameter: `videoId`. |
| `PATCH` | `/api/v1/videos/update_video_file/:videoId` | Yes | Replaces the video file and duration. | Multipart field: `video`. |
| `PATCH` | `/api/v1/videos/update_title/:videoId` | Yes | Updates a video title owned by the current user. | Body: `title`. |
| `PATCH` | `/api/v1/videos/update_desc/:videoId` | Yes | Updates a video description owned by the current user. | Body: `description`. |
| `PATCH` | `/api/v1/videos/update_thumbnail/:videoId` | Yes | Replaces a video thumbnail. | Multipart field: `thumbnail`. |
| `PATCH` | `/api/v1/videos/publish_status/:videoId` | Yes | Toggles `isPublished` for an owned video. | Path parameter: `videoId`. |

### Comments

| Method | Route | Auth | Purpose | Request / response |
|---|---|---|---|---|
| `POST` | `/api/v1/comments/c/:videoId` | Yes | Adds a comment to a video. | Body: `content`; path parameter: `videoId`. |
| `GET` | `/api/v1/comments/c/videoId` | Yes | Fetches comments. | The route is literally `c/videoId`; the controller expects `req.params.videoId`, but this route does not declare a `:videoId` parameter. |
| `PATCH` | `/api/v1/comments/c/:commentId` | Yes | Updates an owned comment. | Body: `content`; path parameter: `commentId`. |
| `DELETE` | `/api/v1/comments/c/:commentId` | Yes | Deletes an owned comment. | Path parameter: `commentId`. |

### Tweets

| Method | Route | Auth | Purpose | Request / response |
|---|---|---|---|---|
| `POST` | `/api/v1/tweets/add_tweet` | Yes | Creates a tweet owned by the current user. | Body: `content`. |
| `GET` | `/api/v1/tweets/tweet/:userId` | Yes | Lists tweets for a user. | Path parameter: `userId`. |
| `GET` | `/api/v1/tweets/my_tweets` | Yes | Lists the current user's tweets. | No body. |
| `PATCH` | `/api/v1/tweets/update_tweet` | Yes | Updates an owned tweet. | Controller expects body `content` and parameter `tweetId`, but the route declares no `:tweetId` parameter. |
| `DELETE` | `/api/v1/tweets/delete_tweet` | Yes | Deletes an owned tweet. | Controller expects parameter `tweetId`, but the route declares no `:tweetId` parameter. |

### Likes

| Method | Route | Auth | Purpose | Request / response |
|---|---|---|---|---|
| `POST` | `/api/v1/likes/toggle/:type/:id` | Yes | Toggles a like. | `type` must be `video`, `comment`, or `tweet`; `id` must be a valid MongoDB ObjectId. |

### Playlists

| Method | Route | Auth | Purpose | Request / response |
|---|---|---|---|---|
| `POST` | `/api/v1/playlist/create` | Yes | Creates a playlist. | Body: `name`, `description`. |
| `GET` | `/api/v1/playlist/get_user_playlists` | Yes | Lists playlists owned by the current user. | No body. |
| `GET` | `/api/v1/playlist/get_playlist` | Yes | Fetches a playlist. | Controller expects `playlistId`, but the route declares no `:playlistId` parameter. |
| `PATCH` | `/api/v1/playlist/add_video/:playlistId/:videoId` | Yes | Adds a video reference to a playlist. | Path parameters: `playlistId`, `videoId`. |
| `DELETE` | `/api/v1/playlist/remove_video/:playlistId/:videoId` | Yes | Removes a video reference. | The route references `removeVideoToPlaylist`, which is not imported in `playlist.routes.js`. |
| `DELETE` | `/api/v1/playlist/delete_playlist/:playlistId` | Yes | Deletes an owned playlist. | Path parameter: `playlistId`; the current controller does not send a response after deletion. |
| `PATCH` | `/api/v1/playlist/update_playlist/:playlistId` | Yes | Updates playlist metadata. | Body is intended to contain title/description; the controller currently references an undeclared `name`. |

### Subscriptions

| Method | Route | Auth | Purpose | Request / response |
|---|---|---|---|---|
| `POST` | `/api/v1/subscription/toggle` | Yes | Toggles a subscription. | The controller expects `channelId` in `req.params`, but this route declares no path parameter. |
| `GET` | `/api/v1/subscription/subscribers` | Yes | Lists channel subscribers. | The controller expects `channelId` in `req.params`, but this route declares no path parameter. |
| `GET` | `/api/v1/subscription/channels` | Yes | Lists subscribed channels. | The controller expects `subscriberId` in `req.params`, but this route declares no path parameter. |

### Dashboard

| Method | Route | Auth | Purpose | Request / response |
|---|---|---|---|---|
| `GET` | `/api/v1/dashboard/stats` | Intended protected | Placeholder for channel statistics. | `getChannelStats` currently contains only a TODO and does not send a response. |
| `GET` | `/api/v1/dashboard/videos` | Intended protected | Placeholder for channel videos. | `getChannelVideos` currently contains only a TODO and does not send a response. |

### Response shape

Successful controller responses generally use `ApiResponse`, which contains `statusCode`, `data`, `message`, and `success`. Error middleware returns JSON with `success: false` and `message`; in non-production mode it also includes `stack`.

## Authentication & Authorization

Authentication is intended to use two JWTs:

- An access token identifies the user and is placed in an `accessToken` HTTP-only, secure cookie during login and refresh.
- A refresh token is placed in a `refreshToken` HTTP-only, secure cookie and also persisted on the user document.
- `protect` in `src/middlewares/auth.middleware.js` verifies the access token and loads the user without `password` or `refreshToken`.
- Controllers enforce ownership in several update/delete queries by including `owner: req.user._id`.

There is no separate role or administrator authorization system in the current models. The dashboard router imports and applies `verifyJWT`, but `auth.middleware.js` currently exports `protect`, not `verifyJWT`; this prevents that router from loading as written. Several authentication-related controller calls also contain naming or implementation defects, so the flow should be tested and corrected before production use.

## Database

MongoDB is connected through `mongoose.connect` in `src/config/db.js`. The connection uses the database name `yt-clone` and exits the process when connection setup fails.

The current Mongoose models are:

- **`User`** — username, email, full name, avatar, cover image, password, refresh token, and `watchHistory` references. Passwords are hashed with `bcrypt` in a `pre('save')` hook.
- **`Video`** — video URL, thumbnail URL, title, description, duration, publication state, view count, and owner reference. The aggregate pagination plugin is attached.
- **`Comment`** — content, video reference, owner reference, and timestamps.
- **`Tweet`** — content, owner reference, and timestamps.
- **`Like`** — optional video/comment/tweet target fields, `likedBy`, and timestamps.
- **`Playlist`** — name, description, video references, owner reference, and timestamps.
- **`Subscription`** — subscriber and channel user references.

The model relationships are represented using MongoDB ObjectIds and Mongoose `ref` values. Some controller field names do not match their schemas—for example, comments are created with `videoId` while the schema defines `video`—so relationship behavior is not fully consistent in the current implementation.

## Middleware

- `morgan('dev')` logs HTTP requests.
- `express.json()` parses JSON request bodies.
- `express.urlencoded({ extended: true, limit: '16kb' })` parses URL-encoded bodies.
- `express.static('public')` serves files from `public`.
- `cookie-parser` exposes cookies on `req.cookies`.
- `protect` attempts to authenticate requests with an access-token cookie or Authorization header.
- `upload` uses Multer disk storage and writes files to `./public/temp` using the original filename.
- `notFound` returns a JSON 404 response for unmatched routes.
- `errorHandler` normalizes Mongoose validation and cast errors, logs server-side details, hides 5xx messages in production, and includes stack traces outside production.

## Error Handling

Controllers commonly throw `ApiError` instances and are wrapped with `asyncHandler`. The application also installs `notFound` and `errorHandler` after all routers. `errorHandler` uses `err.statusCode`, `err.status`, or `500`, translates Mongoose `ValidationError` and `CastError` instances into 400 responses, and returns a JSON error object.

The repository contains two inconsistent async-handler patterns: controllers import `helpers/asyncHandler.js`, whose current implementation references `fn` instead of its `fa` argument, while some unfinished dashboard imports reference a non-existent `utils` helper. These issues should be resolved before relying on centralized async error propagation.

## External Services

Cloudinary is used by `uploadOnCloudinary` for video, thumbnail, avatar, and cover-image uploads. Multer first stores the file locally under `public/temp`; the Cloudinary helper uploads it with `resource_type: 'auto'`. On upload failure it attempts to delete the local temporary file.

The current Cloudinary SDK configuration is embedded in source code. Credentials are intentionally not reproduced here and should be removed from source, rotated, and supplied through secure environment configuration.

## Development Notes

- `src/app.js` mounts all API routers under `/api/v1`.
- `server.js` is the runtime entry point; `src/app.js` exports the configured Express app.
- The repository uses ES modules (`"type": "module"` in `package.json`).
- Temporary upload files use their original filenames, which can cause collisions and should be replaced with safe unique names.
- There is no automated test suite in the repository; `npm test` currently fails intentionally.
- Before deployment, address unresolved imports, undefined identifiers, incorrect Mongoose method names, missing route parameters, hard-coded Cloudinary credentials, token configuration inconsistencies, and incomplete dashboard handlers.

## Git / Contribution Guidelines

No repository-specific contribution guide, branch policy, or pull-request template is present. For changes, keep controllers, routes, models, and middleware consistent with the existing `src/` layout; update this README when verified API behavior or configuration changes; and add automated tests before changing the test script from its current placeholder.

## License

`package.json` declares the package license as `ISC`. No standalone `LICENSE` file was found in the repository.
