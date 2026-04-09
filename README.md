# SheetSense

SheetSense is a full-stack web application that lets users upload CSV/XLSX files, convert data into interactive charts, and download PDF reports.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL (Neon compatible)
- Charts: Recharts
- File Parsing: xlsx (SheetJS)
- PDF Generation: pdfkit
- Authentication: JWT + bcryptjs

## Features

- Signup/Login with JWT authentication
- Protected routes for app features
- CSV/XLSX upload with validation (type + size)
- Data parsing and cleanup (invalid rows ignored)
- Interactive chart rendering (Bar/Line)
- Tooltip and responsive chart layout
- Data filtering (top N and category keyword)
- PDF report generation with chart image and summary
- File history per user
- Rename and delete file history records
- In-app delete confirmation dialog (custom modal)
- Inline rename on chart page (pen icon)
- Back button on chart page

## Project Structure Explanation

```text
SheetSense/
  backend/
    src/
      app.js              # Express app setup (middlewares, routes)
      server.js           # Backend entry point
      config/             # DB configuration
      controllers/        # Request handlers
      middlewares/        # Auth and upload middleware
      models/             # DB query layer
      routes/             # API route definitions
      services/           # Business logic
      utils/              # Parsing and summary helpers
  frontend/
    src/
      App.jsx             # Route composition and layout handling
      components/         # Reusable UI components
      context/            # Auth context
      hooks/              # Custom hooks
      pages/              # Screen-level components
      services/           # API client methods
      utils/              # Frontend helper functions
  database/
    schema.sql            # PostgreSQL schema
```

## Setup Instructions

### 1. Install dependencies

```bash
# backend
cd backend
npm install

# frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://username:password@host:5432/database_name
JWT_SECRET=replace_with_secure_secret
```

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Create database tables

Run SQL from `database/schema.sql` on your PostgreSQL/Neon database.

### 4. Start the app

Open two terminals:

```bash
# terminal 1
cd backend
npm run dev

# terminal 2
cd frontend
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`

### Files

- `POST /api/upload` (protected)
- `GET /api/files` (protected)
- `GET /api/files/:id` (protected)
- `PATCH /api/files/:id` (protected, rename)
- `DELETE /api/files/:id` (protected, delete)

### PDF

- `POST /api/pdf` (protected)

### Health

- `GET /api/health`

## Assumptions Made

- Dataset format uses two primary columns:
  - Column A: label (text)
  - Column B: value (numeric)
- Empty label rows and non-numeric values are skipped during parsing.
- First worksheet is used for `.xlsx` files.
- Uploaded files are processed in-memory and then persisted as normalized rows.
- Authentication token is stored in localStorage for simplicity in this project scope.
- Deleting a file also removes related data rows (via DB cascade rules).

## Notes

- PDF report includes chart image plus auto-generated data summary.
- Upload validation accepts common CSV/XLSX MIME types and filename extensions.
