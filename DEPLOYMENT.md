# Deployment Guide - Save Point

This guide will help you deploy your Save Point application with the backend on Render and frontend on Vercel.

## Prerequisites

- GitHub account (for connecting to Render and Vercel)
- MongoDB Atlas database (you already have this!)
- Your code pushed to a GitHub repository

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Your Backend

Your backend is already configured! Just make sure your code is pushed to GitHub.

### Step 2: Create Render Account

1. Go to [https://render.com](https://render.com)
2. Sign up using your GitHub account
3. Authorize Render to access your repositories

### Step 3: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your **Save Point** repository

### Step 4: Configure Service

Fill in these settings:

- **Name**: `savepoint-backend` (or any name you prefer)
- **Region**: Choose closest to you (e.g., Oregon)
- **Branch**: `main` (or your default branch)
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### Step 5: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add these:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://ishashwatdubey_db_user:tj3ShTbk6MNAqiDQ@cluster0.87co2zl.mongodb.net/save_point_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-in-production-PLEASE-CHANGE-THIS
JWT_EXPIRE=7d
CLIENT_URL=https://your-app-name.vercel.app
```

⚠️ **IMPORTANT**: 
- Change the `JWT_SECRET` to a strong random string
- You'll update `CLIENT_URL` after deploying to Vercel

### Step 6: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, copy your backend URL (e.g., `https://savepoint-backend.onrender.com`)

### Step 7: Test Your Backend

Visit: `https://your-backend-url.onrender.com/api/health`

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-12-05T..."
}
```

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up using your GitHub account
3. Authorize Vercel to access your repositories

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your **Save Point** repository
3. Vercel will detect it's a monorepo

### Step 3: Configure Project

- **Framework Preset**: `Vite`
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Add Environment Variable

Click **"Environment Variables"** and add:

```
VITE_API_URL=https://your-backend-url.onrender.com
```

Replace `your-backend-url` with your actual Render backend URL from Part 1.

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Once deployed, copy your frontend URL (e.g., `https://save-point.vercel.app`)

### Step 6: Update Backend CORS

1. Go back to **Render dashboard**
2. Open your backend service
3. Go to **"Environment"**
4. Update `CLIENT_URL` to your Vercel URL:
   ```
   CLIENT_URL=https://your-app-name.vercel.app
   ```
5. Save changes (this will trigger a redeploy)

---

## Part 3: Verify Everything Works

### Test Your Deployment

1. Visit your Vercel URL
2. Try to register a new account
3. Login with your account
4. Create a habit, task, or note
5. Check if everything syncs properly

### Common Issues & Solutions

#### Issue: CORS Error
**Solution**: Make sure `CLIENT_URL` in Render matches your Vercel URL exactly (no trailing slash)

#### Issue: API calls failing
**Solution**: Check that `VITE_API_URL` in Vercel points to your Render backend URL

#### Issue: Database connection error
**Solution**: Verify your MongoDB Atlas IP whitelist includes `0.0.0.0/0` for connections from anywhere

#### Issue: Backend takes long to respond first time
**Solution**: Render free tier spins down after inactivity. First request may take 30-60 seconds.

---

## Part 4: Custom Domain (Optional)

### For Frontend (Vercel)

1. Go to your Vercel project settings
2. Click **"Domains"**
3. Add your custom domain
4. Update DNS records as instructed by Vercel

### For Backend (Render)

1. Go to your Render service settings
2. Click **"Custom Domains"**
3. Add your custom domain
4. Update DNS records as instructed by Render

---

## Automatic Deployments

Both Vercel and Render are now configured for automatic deployments:

- **Push to GitHub** → Automatic deployment
- **Main branch** → Production deployment
- **Other branches** → Preview deployments (Vercel only)

---

## MongoDB Atlas Configuration

Your MongoDB is already set up, but ensure:

1. Go to MongoDB Atlas dashboard
2. Click **"Network Access"**
3. Make sure you have IP whitelist: `0.0.0.0/0` (allow from anywhere)
   - This is needed for Render to connect

---

## Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRE=7d
CLIENT_URL=<your-vercel-url>
```

### Frontend (Vercel)
```
VITE_API_URL=<your-render-backend-url>
```

---

## Deployment Costs

- **Render Free Tier**: 750 hours/month (enough for 1 service running 24/7)
- **Vercel Free Tier**: 100 GB bandwidth, unlimited deployments
- **MongoDB Atlas Free Tier**: 512 MB storage

All free! Perfect for your project.

---

## Monitoring & Logs

### Render Logs
1. Go to Render dashboard
2. Click your service
3. Click **"Logs"** tab
4. View real-time logs

### Vercel Logs
1. Go to Vercel dashboard
2. Click your project
3. Click **"Deployments"**
4. Click any deployment → **"Build Logs"** or **"Function Logs"**

---

## Next Steps

1. Deploy backend to Render ✅
2. Deploy frontend to Vercel ✅
3. Test everything works ✅
4. Share your app with the world! 🎉

---

## Support

If you encounter issues:
- Check Render logs for backend errors
- Check browser console for frontend errors
- Verify environment variables are correct
- Make sure MongoDB Atlas allows connections from anywhere

Good luck with your deployment! 🚀
