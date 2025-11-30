# Save Point Backend - Quick Setup Guide

Get your Save Point backend up and running in minutes!

## Prerequisites Check

Before starting, verify you have:

```bash
# Check Node.js (need v18+)
node -v

# Check npm
npm -v

# Check MongoDB
mongo --version
# OR check if MongoDB service is running
```

## Step 1: Install Dependencies (2 minutes)

Navigate to the server directory and install packages:

```bash
cd server
npm install
```

This will install all required packages:
- express
- mongoose
- bcrypt
- jsonwebtoken
- cors
- helmet
- express-validator
- express-rate-limit
- morgan
- dotenv
- node-cron
- nodemon (dev)

## Step 2: Configure Environment (1 minute)

The `.env` file should already exist. Verify/update these values:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/savepoint
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

**Important:** Change `JWT_SECRET` to a secure random string in production!

Generate a secure JWT secret:
```bash
# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# On Mac/Linux:
openssl rand -base64 32
```

## Step 3: Start MongoDB (if not running)

### Local MongoDB

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
```

**Mac (Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### MongoDB Atlas (Cloud)

If using MongoDB Atlas:
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/savepoint?retryWrites=true&w=majority
```

## Step 4: Seed the Database (1 minute)

Populate the database with default achievements:

```bash
npm run seed
```

You should see:
```
MongoDB Connected: localhost
✅ Achievements seeded successfully
```

This creates 15 default achievements for the gamification system.

## Step 5: Start the Server

### Development Mode (recommended for coding)

```bash
npm run dev
```

This starts the server with auto-reload using nodemon.

### Production Mode

```bash
npm start
```

## Step 6: Verify Installation

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

Test the health check endpoint:

**Using curl:**
```bash
curl http://localhost:5000/api/health
```

**Using browser:**
Navigate to: http://localhost:5000/api/health

**Expected response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## Step 7: Test with the Frontend

1. Make sure the client is configured to point to the backend:
   - Check `client/.env` or `client/src/services/api.js`
   - Should have: `baseURL: '/api'` or `http://localhost:5000/api`

2. Start the frontend:
```bash
cd ../client
npm run dev
```

3. The frontend should now connect to your backend!

## Quick Test Checklist

- [ ] MongoDB is running
- [ ] Environment variables are set
- [ ] Dependencies are installed
- [ ] Achievements are seeded
- [ ] Server starts without errors
- [ ] Health check returns 200 OK
- [ ] Frontend connects successfully

## Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"

**Solution:**
1. Check if MongoDB is running:
   ```bash
   # Windows
   net start MongoDB

   # Mac
   brew services list

   # Linux
   sudo systemctl status mongod
   ```

2. Verify MONGODB_URI in `.env`

3. Check MongoDB logs for errors

---

### Issue: "Port 5000 already in use"

**Solution:**
1. Change PORT in `.env` to another port (e.g., 5001)
2. OR kill the process using port 5000:
   ```bash
   # Windows
   npx kill-port 5000

   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   ```

---

### Issue: "JWT malformed" or authentication errors

**Solution:**
1. Make sure JWT_SECRET is set in `.env`
2. Re-login to get a new token
3. Check token format in Authorization header: `Bearer <token>`

---

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

---

### Issue: "Cannot find module" with ES modules

**Solution:**
Verify `package.json` has:
```json
{
  "type": "module"
}
```

---

## Testing the API

### Using Postman

1. Download Postman: https://www.postman.com/downloads/
2. Create a new collection
3. Add these requests:

**Register User:**
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Get Habits (requires token):**
```
GET http://localhost:5000/api/habits
Headers:
Authorization: Bearer <paste_token_here>
```

### Using curl

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Development Workflow

1. **Make changes** to code
2. **Server auto-reloads** (with nodemon)
3. **Test** using Postman or frontend
4. **Check logs** in terminal
5. **Commit** changes

## Project Structure Reference

```
server/
├── src/
│   ├── config/          # Database connection
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # Request handlers
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, validation, errors
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── .env                 # Environment variables
├── package.json         # Dependencies
└── README.md           # Documentation
```

## Next Steps

1. ✅ Backend is running
2. 📱 Connect frontend to backend
3. 🧪 Test user registration and login
4. 📝 Create your first habit
5. 🎮 Watch gamification in action!

## Useful Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Seed achievements
npm run seed

# Install new package
npm install package-name

# Check server logs
# Just watch the terminal where server is running
```

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development / production |
| PORT | Server port | 5000 |
| MONGODB_URI | Database connection | mongodb://localhost:27017/savepoint |
| JWT_SECRET | Secret for JWT tokens | random_secure_string |
| JWT_EXPIRE | Token expiration time | 7d |
| CLIENT_URL | Frontend URL (for CORS) | http://localhost:5173 |

## Database Collections

After seeding and using the app, you'll have these collections:

- **users** - User accounts and gamification data
- **habits** - User habits and completions
- **tasks** - User tasks and subtasks
- **achievements** - Badge definitions
- **sessions** - Habit check-in sessions (future)

View in MongoDB Compass or CLI:
```bash
mongo
> use savepoint
> show collections
> db.users.find().pretty()
```

## Production Deployment Notes

When deploying to production:

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Use MongoDB Atlas or managed MongoDB
4. Enable HTTPS
5. Set up proper CORS for your domain
6. Consider using PM2 for process management
7. Set up monitoring and logging
8. Use environment variables (never commit `.env`)

## Getting Help

- **Backend Issues:** Check server logs in terminal
- **Database Issues:** Check MongoDB logs
- **API Issues:** Check API_DOCUMENTATION.md
- **Frontend Connection:** Check CORS settings and client baseURL

## Success! 🎉

Your backend is now ready! You should be able to:
- ✅ Register and login users
- ✅ Create and manage habits
- ✅ Create and manage tasks
- ✅ Track streaks and earn points
- ✅ Unlock achievements
- ✅ View analytics and stats

Happy coding! 🚀
