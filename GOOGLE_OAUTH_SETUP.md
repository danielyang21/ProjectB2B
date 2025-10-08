# Google OAuth Setup Instructions

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "B2B Service Finder")
4. Click "Create"

## Step 2: Enable Google OAuth

1. In the left sidebar, go to **APIs & Services** → **OAuth consent screen**
2. Choose "External" and click "Create"
3. Fill in the required fields:
   - App name: `B2B Service Finder`
   - User support email: Your email
   - Developer contact: Your email
4. Click "Save and Continue"
5. Skip "Scopes" (click "Save and Continue")
6. Add test users if needed (your email)
7. Click "Save and Continue"

## Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click "**+ CREATE CREDENTIALS**" → "OAuth client ID"
3. Choose "Web application"
4. Name it: `B2B Service Finder Web Client`
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:5173` (Vite dev server)
   - `http://localhost:3000` (if using different port)
6. Under **Authorized redirect URIs**, add:
   - `http://localhost:5173`
   - `http://localhost:3000`
7. Click "Create"
8. **Copy the Client ID** - you'll need this!

## Step 4: Configure Environment Variables

### Backend (.env in /backend folder)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/b2b-service-finder
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
```

### Frontend (.env in root folder)

```env
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

**Important**: Use the **same Client ID** in both files!

## Step 5: Generate a JWT Secret

Run this command in your terminal to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET` in the backend `.env` file.

## Step 6: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd ..
npm install
```

## Step 7: Start the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
npm run dev
```

## Step 8: Test Authentication

1. Go to `http://localhost:5173`
2. Click "Sign In" in the navbar
3. Click the "Continue with Google" button
4. Sign in with your Google account
5. You should be redirected back and see your profile in the navbar!

## Troubleshooting

### "Error 400: redirect_uri_mismatch"
- Make sure `http://localhost:5173` is added to **Authorized JavaScript origins** in Google Console
- Check that there are no trailing slashes

### "Error 401: invalid_client"
- Double-check that your `GOOGLE_CLIENT_ID` matches in both frontend and backend `.env` files
- Make sure you're using the **Client ID**, not the Client Secret

### "Token verification failed"
- Ensure your backend `.env` has the correct `GOOGLE_CLIENT_ID`
- Restart the backend server after changing `.env` files

### "User not authenticated"
- Check browser console for errors
- Make sure the backend server is running on port 5000
- Verify `JWT_SECRET` is set in backend `.env`

## Features Enabled with Authentication

✅ **Persistent Matches** - Your matches are saved to your account
✅ **Cross-Device Sync** - Access your matches from any device
✅ **Personalized Recommendations** - AI learns your preferences
✅ **Contact Companies** - Direct messaging (coming soon)
✅ **Save Search History** - Never lose your searches

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique JWT secrets in production
- For production, update **Authorized JavaScript origins** to your domain
- Enable additional OAuth scopes if needed for email/profile access
