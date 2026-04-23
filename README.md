# Quiz App

A full-stack quiz application built with Next.js, Express, and MongoDB. This project follows modern development practices with a focus on type safety and scalable architecture.

---

## Tech Stack

### Frontend

- Framework: [Next.js](https://nextjs.org/) (App Router)
- Styling: [Tailwind CSS](https://tailwindcss.com/)
- Data Fetching & Caching: [TanStack Query](https://tanstack.com/query/latest)
- UI Components: [Radix UI](https://www.radix-ui.com/) and [Lucide Icons](https://lucide.dev/)
- Forms: React Hook Form with Zod validation

### Backend

- Runtime: Node.js with TypeScript
- Framework: [Express.js](https://expressjs.com/)
- Database: [MongoDB](https://www.mongodb.com/) using Mongoose
- Authentication: JWT (JSON Web Tokens) with secure HttpOnly cookies
- Validation: [Zod](https://zod.dev/)

---

## Project Structure

```text
.
├── backend/     # Express API server
└── frontend/    # Next.js web application
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm package manager
- MongoDB instance

### Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd quiz
   ```

2. Backend Setup

   ```bash
   cd backend
   pnpm install
   ```

   Create a .env file in the backend directory:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

3. Frontend Setup
   ```bash
   cd ../frontend
   pnpm install
   ```
   Create a .env file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_TRIVIA_API_URL=https://the-trivia-api.com/api
   ```

---

## Running the Application

It is recommended to run the backend and frontend in separate terminal windows.

### Start Backend

```bash
cd backend
pnpm dev
```

### Start Frontend

```bash
cd frontend
pnpm dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## Features

- User Authentication (Signup/Login)
- Dynamic Quiz Categories
- Real-time Score Tracking
- Responsive Design
- Form Validation with Zod
