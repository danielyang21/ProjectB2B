# B2B Service Finder - Backend API

Node.js/Express backend with MongoDB for the B2B Service Finder application.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or remote connection)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` if needed (default: `mongodb://localhost:27017/b2b-service-finder`)

3. Start MongoDB (if running locally):
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

4. Seed the database with mock data:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Services

- `GET /api/services` - Get all services
  - Query parameters:
    - `search` - Search by company name, description, location, or services
    - `services` - Filter by services (comma-separated)
    - `industry` - Filter by industry (comma-separated)
    - `companySize` - Filter by company size (comma-separated)
    - `verified` - Filter by verification status (true/false)

- `GET /api/services/:id` - Get single service by ID
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Health Check

- `GET /health` - Check if server is running

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with mock data
