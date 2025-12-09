# Keep-Alive Guide for Render Free Tier

This guide provides multiple solutions to prevent your Render backend from sleeping, ensuring your app remains responsive even after periods of inactivity.

## Problem

Render's free tier puts your backend to sleep after 15 minutes of inactivity. When a mobile browser reloads the site, the frontend hangs while waiting for the backend to wake up (can take 30-60 seconds).

## Solutions

### Option 1: Self-Hosted Keep-Alive Page (Recommended)

Deploy the included `keep-alive.html` file to a free static hosting service.

#### Steps:

1. **Configure the Backend URL**

   Edit `keep-alive.html` and replace:
   ```javascript
   const BACKEND_URL = 'YOUR_BACKEND_URL_HERE';
   ```

   With your Render backend URL:
   ```javascript
   const BACKEND_URL = 'https://your-app.onrender.com';
   ```

2. **Deploy to Free Static Hosting**

   **Option A: Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel keep-alive.html
   ```

   **Option B: Netlify**
   ```bash
   # Install Netlify CLI
   npm i -g netlify-cli

   # Deploy
   netlify deploy --prod --dir=. --file=keep-alive.html
   ```

   **Option C: GitHub Pages**
   - Create a new GitHub repository
   - Upload `keep-alive.html` as `index.html`
   - Enable GitHub Pages in repository settings
   - Your keep-alive page will be at `https://yourusername.github.io/repo-name`

3. **Keep the Page Open**

   - Open the deployed keep-alive page in a browser tab
   - The page will automatically ping your backend every 5 minutes
   - Monitor stats and logs directly on the page

**Pros:**
- Free forever
- Visual monitoring dashboard
- Full control over ping frequency
- No external dependencies

**Cons:**
- Requires a browser tab to stay open (can use an old device/tablet)

---

### Option 2: UptimeRobot (Easiest - No Code)

UptimeRobot is a free uptime monitoring service that pings your backend automatically.

#### Steps:

1. Go to [UptimeRobot.com](https://uptimerobot.com) and sign up for free

2. Click "Add New Monitor"

3. Configure:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** Save Point Backend
   - **URL:** `https://your-app.onrender.com/api/health`
   - **Monitoring Interval:** 5 minutes (free tier)

4. Click "Create Monitor"

**Pros:**
- Completely free (up to 50 monitors)
- No maintenance required
- Email alerts if backend goes down
- Mobile app available

**Cons:**
- 5-minute intervals only (can't go lower on free tier)
- Less flexible than custom solutions

---

### Option 3: Cron-Job.org

Free cron job service for scheduled HTTP requests.

#### Steps:

1. Go to [cron-job.org](https://cron-job.org) and create free account

2. Create a new cron job:
   - **Title:** Save Point Keep-Alive
   - **Address:** `https://your-app.onrender.com/api/health`
   - **Schedule:** Every 5 minutes
   - **Method:** GET

3. Save and enable

**Pros:**
- Free and reliable
- Multiple schedule options
- Execution history

**Cons:**
- Requires account creation
- Limited to specific intervals

---

### Option 4: GitHub Actions (Developer-Friendly)

Use GitHub Actions to ping your backend automatically.

#### Steps:

1. Create `.github/workflows/keep-alive.yml` in your repository:

```yaml
name: Keep Backend Alive

on:
  schedule:
    # Run every 5 minutes
    - cron: '*/5 * * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Backend
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" https://your-app.onrender.com/api/health)
          if [ $response -eq 200 ]; then
            echo "✓ Backend is alive (HTTP $response)"
          else
            echo "✗ Backend ping failed (HTTP $response)"
            exit 1
          fi
```

2. Replace `https://your-app.onrender.com` with your actual backend URL

3. Commit and push to GitHub

4. GitHub Actions will automatically ping your backend every 5 minutes

**Pros:**
- Free for public repositories
- Integrates with your existing workflow
- Full control and customization
- Can add notifications on failure

**Cons:**
- Requires GitHub repository
- Limited free minutes on private repos (2000/month, but each ping uses <1 minute)

---

### Option 5: Render Cron Job (Same Platform)

Use Render's built-in cron job feature (free tier available).

#### Steps:

1. Go to your Render dashboard

2. Click "New +" → "Cron Job"

3. Configure:
   - **Name:** keep-alive-ping
   - **Command:** `curl https://your-app.onrender.com/api/health`
   - **Schedule:** `*/5 * * * *` (every 5 minutes)

4. Deploy

**Pros:**
- Everything in one platform
- Simple setup
- Free tier available

**Cons:**
- Uses a separate Render service
- Free cron jobs have limited executions

---

### Option 6: Upgrade to Paid Plan

The most reliable solution is to upgrade your Render backend.

#### Pricing (as of 2024):

- **Starter Plan:** $7/month
  - Always-on (no sleep)
  - Faster cold starts
  - Better performance

**Pros:**
- No configuration needed
- Best performance
- Professional solution

**Cons:**
- Costs money

---

## Comparison Table

| Solution | Cost | Setup Difficulty | Reliability | Maintenance |
|----------|------|------------------|-------------|-------------|
| Keep-Alive Page | Free | Easy | High* | Low |
| UptimeRobot | Free | Very Easy | High | None |
| Cron-Job.org | Free | Easy | High | None |
| GitHub Actions | Free** | Medium | High | Low |
| Render Cron | Free*** | Easy | High | None |
| Paid Plan | $7/mo | Very Easy | Very High | None |

\* Requires browser tab open
\** Free for public repos, limited for private
\*** Limited executions on free tier

---

## Recommended Solution

**For most users:** Use **UptimeRobot** - it's the easiest setup with zero maintenance.

**For developers:** Use **GitHub Actions** - integrates with your workflow and provides monitoring.

**For visual monitoring:** Use the **Keep-Alive Page** - great for testing and debugging.

**For production apps:** **Upgrade to paid plan** - most reliable and professional.

---

## Additional Optimizations

Even with keep-alive, you should implement these frontend optimizations:

### 1. Service Worker (Already Implemented)
Caches static assets for instant loading even if backend is slow.

### 2. Retry Logic (Already Implemented)
Automatically retries failed requests with exponential backoff.

### 3. Loading States (Already Implemented)
Shows users a "Backend waking up" message instead of hanging.

### 4. Local Storage Caching
Cache non-sensitive data in localStorage for instant display:

```javascript
// Example: Cache dashboard data
const cachedData = localStorage.getItem('dashboard_cache');
if (cachedData) {
  setData(JSON.parse(cachedData)); // Show cached data immediately
}

// Then fetch fresh data
const freshData = await api.get('/dashboard');
setData(freshData);
localStorage.setItem('dashboard_cache', JSON.stringify(freshData));
```

---

## Testing

To test if your keep-alive solution is working:

1. Stop using your app for 20 minutes
2. Check your keep-alive service logs/dashboard
3. Reload the app on mobile
4. It should load quickly without the "waking up" message

---

## Troubleshooting

### Backend still sleeps despite keep-alive

**Possible causes:**
- Keep-alive service stopped running
- Ping interval too long (>15 minutes)
- Incorrect backend URL
- CORS blocking requests

**Solutions:**
- Verify keep-alive service is running
- Check logs for errors
- Reduce ping interval to 5-10 minutes
- Ensure `/api/health` endpoint allows all origins

### Too many requests error

**Cause:** Pinging too frequently

**Solution:** Increase interval to 5-10 minutes (3-5 minutes can trigger rate limits)

---

## Environment Variables

If using the keep-alive page, you can configure these in the script:

```javascript
const BACKEND_URL = 'https://your-app.onrender.com';
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
const MAX_LOG_ENTRIES = 20; // Number of log entries to display
```

---

## Support

If you encounter issues:

1. Check Render dashboard for backend status
2. Verify `/api/health` endpoint works manually
3. Check keep-alive service logs
4. Ensure no CORS errors in browser console

---

## License

This keep-alive solution is part of the Save Point project and is free to use and modify.
