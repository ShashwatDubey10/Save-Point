# Quick Deployment Checklist

## Backend (Render)

1. **Go to render.com** → Sign up with GitHub
2. **New Web Service** → Select your repo
3. **Configure:**
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=<your-existing-mongodb-uri>
   JWT_SECRET=<generate-random-secret>
   CLIENT_URL=https://<will-add-after-vercel>.vercel.app
   ```
5. **Deploy** → Copy backend URL

## Frontend (Vercel)

1. **Go to vercel.com** → Sign up with GitHub
2. **Import Project** → Select your repo
3. **Configure:**
   - Root Directory: `client`
   - Framework: Vite
4. **Environment Variable:**
   ```
   VITE_API_URL=https://<your-render-url>.onrender.com
   ```
5. **Deploy** → Copy frontend URL

## Final Step

Go back to Render → Update `CLIENT_URL` with your Vercel URL → Redeploy

## Test

Visit your Vercel URL and test:
- ✅ Register/Login
- ✅ Create habit/task/note
- ✅ All features work

Done! 🎉
