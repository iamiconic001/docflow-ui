# DocFlow UI

React frontend for the Document Processing System.

## Tech Stack

- React (Vite)
- React Router DOM
- Axios
- Context API (no Redux)
- Plain CSS

## Setup

```bash
npm install
npm start
```

The app runs at `http://localhost:5173` by default.

## Environment

The API base URL is configured in `.env`:

```
VITE_API_URL=http://13.232.12.75:8081
```

(`REACT_APP_API_URL` is also included in `.env` for reference, but since this
project uses Vite rather than Create React App, the app actually reads
`VITE_API_URL` at runtime via `src/config/api.js`.)

## Auth

- JWT token is stored in `localStorage` under the key `token`.
- An Axios interceptor (`src/config/api.js`) attaches `Authorization: Bearer <token>`
  to every request.
- A `401` response clears the token and redirects to `/login`.
- `/documents`, `/documents/:documentId`, and `/upload` are protected routes —
  unauthenticated users are redirected to `/login`.

## Pages

- `/login` — sign in
- `/documents` — dashboard stats, filterable/paginated document table, auto-refreshes every 10s
- `/upload` — upload a document with progress and metadata
- `/documents/:documentId` — document detail, extracted result, validation errors,
  processing history timeline, download button; auto-refreshes every 5s while `PROCESSING`

## Project Structure

```
src/
  config/api.js           axios instance + interceptors
  context/AuthContext.jsx login/logout/token state
  context/ToastContext.jsx toast notifications
  pages/                  Login, DocumentList, DocumentDetail, Upload
  components/             Navbar, StatusBadge, Timeline, StatCard, ProtectedRoute, Loader
  App.jsx                 routes setup
```

## Build

```bash
npm run build
```
