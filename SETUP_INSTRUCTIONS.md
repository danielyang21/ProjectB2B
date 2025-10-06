# Setup Instructions

## MongoDB Setup

You have two options:

### Option 1: MongoDB Atlas (Recommended - Cloud, No Installation)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free M0 cluster
4. Get your connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/b2b-service-finder?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB Installation

1. Install MongoDB:
   ```bash
   brew install mongodb-community
   ```

2. Start MongoDB:
   ```bash
   brew services start mongodb-community
   ```

3. Verify it's running:
   ```bash
   brew services list
   ```

## Running the Application

1. **Seed the Database** (run this once):
   ```bash
   cd backend
   npm run seed
   ```

   You should see: "Seeded 15 services" (including 8x8, RingCentral, and Zoom)

2. **Start the Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```

   Server will run on http://localhost:5000

3. **Start the Frontend** (in a new terminal):
   ```bash
   npm run dev
   ```

   Frontend will run on http://localhost:5173

## Testing

1. Open http://localhost:5173
2. Go to `/admin` to see all companies
3. You should see 15 companies including 8x8, RingCentral, and Zoom
4. Try adding, editing, and deleting companies

## Troubleshooting

- If MongoDB connection fails, check that MongoDB is running
- If you see "ECONNREFUSED", MongoDB is not started
- Check backend console for error messages
- Make sure `.env` file exists in backend directory
