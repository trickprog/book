# Book Search

A book search app built on the Open Library and Google Books APIs.

- `server/` — Express 5 + TypeScript API
- `client/` — Next.js 16 + React 19 + Tailwind CSS 4 frontend

## Requirements

- Node.js 20 or newer
- npm

## Setup

### 1. Server

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
API_VERSION=/api/v1
SEARCH_URL=https://openlibrary.org
COVER_URL=https://covers.openlibrary.org/b/id
GOOGLE_BOOKS_URL=https://www.googleapis.com/books/v1/volumes
GOOGLE_BOOK_API_KEY=
```

`GOOGLE_BOOK_API_KEY` is optional — leave it blank to call Google Books unauthenticated.

Start it:

```bash
npm run dev
```

The API runs at `http://localhost:5000`, with routes under `/api/v1/books`.

### 2. Client

In a second terminal:

```bash
cd client
npm install
```

Create `client/.env.local`:

```env
API_URL=http://localhost:5000/api/v1
```

Start it:

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

## Scripts

### server

| Command | Description |
| --- | --- |
| `npm run dev` | Start with watch mode (tsx) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build |

### client

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Notes

- Both servers must be running — the client fetches all book data through the API.
- If you change the server's `PORT` or `API_VERSION`, update `API_URL` in `client/.env.local` to match.
