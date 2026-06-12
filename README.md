# Comingle Frontend

![Build](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

This frontend is a React 18 + Vite application that powers the user-facing Comingle experience and parts of the admin-facing UI. It handles authentication flows, feed rendering, responsive layouts, notifications, realtime chat, video-call initiation, settings, profile management, and premium subscription screens.

## Stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- Redux Toolkit
- React Router 6
- Socket.IO Client
- PeerJS
- React Hook Form / Formik / Yup
- React Toastify
- Vite PWA plugin

## Folder Structure

```text
src/
|-- Apis/          # Axios/API wrappers for backend calls
|-- Components/    # Shared, user, admin, and modal components
|-- Interface/     # TypeScript interfaces and types
|-- Middleware/    # Route guards such as IsLoggedIn / IsLoggedOut
|-- Pages/         # Page-level route components
|-- Redux/         # Store, slices, and persisted auth state
|-- Routes/        # Route maps for user/admin flows
|-- Utils/         # Helpers, constants, socket helpers, misc utilities
|-- Validation/    # Form validation schemas
|-- App.tsx
|-- index.css
`-- main.tsx
```

## Scripts

```powershell
npm run dev
npm run build
npm run preview
npm run lint
```

There is also:

```powershell
npm run clean-install
```

Note:

- `clean-install` uses a Unix-style `rm -rf`, so on Windows PowerShell you may prefer manually deleting `node_modules` and `package-lock.json` before running `npm install`.

## Local Development

### 1. Install dependencies

```powershell
cd comingle-client
npm install
```

### 2. Configure `.env`

Expected frontend variables:

- `VITE_BACKEND_URI`
- `VITE_BACKEND_URI_DEV`
- `VITE_NODE_ENV`

Example:

```env
VITE_BACKEND_URI=http://localhost:5000
VITE_BACKEND_URI_DEV=http://localhost:5000
VITE_NODE_ENV=DEVELOPMENT
```

Important:

- The app now derives PeerJS host, port, and protocol from the backend URL.
- The peer signaling endpoint is expected to be available at `/peerjs` on the backend.
- An older `VITE_PEER_SERVER` value may still exist in legacy env files, but the current integrated setup does not require it.

### 3. Start the app

```powershell
npm run dev
```

The Vite dev server runs at:

- `http://localhost:5173`

## Routing Overview

Main user routes from `src/Routes/UserRoute.tsx`:

- `/register`
- `/verify-otp`
- `/login`
- `/forgot-password`
- `/login/success`
- `/`
- `/post/:id`
- `/profile`
- `/profile/:username`
- `/settings`
- `/details`
- `/settings/subscription`
- `/explore`
- `/notifications`
- `/chats`

Route protection:

- `IsLoggedOut` protects guest-only flows
- `IsLoggedIn` protects authenticated app routes

Layout behavior:

- most user pages render inside `Layout`
- the chat page uses a dedicated chat layout path for better screen use

## UI Structure

The frontend is organized around:

- shared surfaces and global tokens in `src/index.css`
- a reusable app shell in `src/Components/User/Layout.tsx`
- page-specific containers under `src/Pages/User`
- modal-driven interactions for posts, followers/following, and create-post flows

Recent UX direction in the app includes:

- responsive shell layout
- improved settings navigation
- cleaner profile pages
- standardized media aspect ratios for posts
- responsive chat layouts
- updated notification and modal styling

## State and Data Flow

The app uses Redux Toolkit for persistent user/session state and API-driven local component state for most page data.

Typical flow:

- user action triggers API call from `Apis/`
- response updates Redux or component-local state
- toast/error UI reflects backend outcomes
- Socket.IO events update realtime sections like chat and notifications

## Realtime Features

### Notifications

The bell icon and notifications page depend on:

- REST fetches for initial notification lists
- Socket.IO events for realtime updates

### Chat

The chat experience uses:

- Socket.IO for room events, typing, presence, and message coordination
- REST endpoints for chat history and persistence

### Video/Audio Calling

The call flow uses:

- Socket.IO for call signaling
- PeerJS for peer connection setup
- WebRTC for audio/video streams

The frontend expects the backend to expose:

- Socket.IO server
- PeerJS endpoint at `/peerjs`

## Media and Upload UX

The frontend includes:

- create-post modal flows
- image/video previews
- standardized post display ratio for feed-style media
- responsive single-post and gallery modals

When debugging uploads:

- verify file size and media type
- check backend Cloudinary/upload configuration
- verify the backend base URL in the frontend env file

## Build Notes

Production build:

```powershell
npm run build
```

This runs:

- TypeScript project build
- Vite production bundling

If bundle warnings appear, they are usually related to:

- large vendor chunks
- third-party packages such as scroll or media-related dependencies

## Frontend Troubleshooting

### App loads but API calls fail

- check `VITE_BACKEND_URI`
- confirm backend is running
- check CORS configuration on the backend

### Chat works but calls fail

- confirm backend `/peerjs` is reachable
- confirm Socket.IO connection is healthy
- verify both clients are online

### Notification badge looks wrong

- check the notification page fetch result
- verify incoming socket events
- inspect any local badge reset logic when visiting `/notifications`

### Layout looks broken on small screens

- test the affected page inside the authenticated layout
- inspect mobile-specific utility classes in shared components

## Suggested Maintenance Areas

If you continue developing the frontend, good next cleanup areas are:

- reducing bundle size
- consolidating repeated modal patterns
- standardizing API error handling
- centralizing socket event typing
- tightening dark-mode consistency across all feature screens
