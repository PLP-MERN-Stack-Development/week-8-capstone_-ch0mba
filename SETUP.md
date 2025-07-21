# Setup Guide

Complete setup instructions for the LogiTrack Logistics Management System.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher)
- **Git** (for version control)
- **MongoDB Atlas account** (or local MongoDB installation)

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd logistics-management-system
```

### 2. Install Dependencies

Install dependencies for both frontend and backend:

```bash
npm run install:all
```

This command will:
- Install root dependencies
- Install frontend dependencies
- Install backend dependencies

### 3. Database Setup

#### Option A: MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Create a New Cluster"
   - Choose the free tier (M0)
   - Select your preferred region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password
   - Set user privileges to "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add your specific IP address for better security

5. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

#### Option B: Local MongoDB

1. **Install MongoDB**
   - Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB Service**
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community

   # On Ubuntu
   sudo systemctl start mongod

   # On Windows
   # MongoDB should start automatically after installation
   ```

### 4. Environment Configuration

#### Backend Environment Variables

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Copy environment template**
   ```bash
   cp .env.example .env
   ```

3. **Edit the .env file**
   ```env
   # MongoDB Atlas connection string
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/logistics?retryWrites=true&w=majority

   # Or for local MongoDB
   # MONGODB_URI=mongodb://localhost:27017/logistics

   # JWT Secret (generate a secure random string)
   JWT_SECRET=your_super_secure_jwt_secret_key_here

   # Environment
   NODE_ENV=development

   # Port
   PORT=5000
   ```

#### Frontend Environment Variables (Optional)

1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

2. **Create .env file**
   ```bash
   touch .env
   ```

3. **Add environment variables**
   ```env
   # API URL (default is http://localhost:5000/api)
   VITE_API_URL=http://localhost:5000/api

   # Google Maps API Key (optional, for maps functionality)
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

### 5. Start the Application

#### Development Mode (Both Frontend and Backend)

From the root directory:
```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

#### Start Services Individually

**Frontend only:**
```bash
npm run dev:frontend
```

**Backend only:**
```bash
npm run dev:backend
```

## 🔧 Configuration Options

### JWT Secret Generation

Generate a secure JWT secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64
```

### Google Maps Setup (Optional)

1. **Get API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the following APIs:
     - Maps JavaScript API
     - Geocoding API
     - Directions API

2. **Add API Key to Environment**
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

## 🗄 Database Initialization

The application will automatically create the necessary collections when you start using it. However, you can seed initial data:

### Create Admin User

1. **Start the application**
2. **Register a new user** through the frontend
3. **Manually update user role** in MongoDB:
   ```javascript
   // In MongoDB Compass or Atlas
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

### Sample Data (Optional)

You can create sample data through the application interface or import sample data:

```javascript
// Sample delivery data
{
  "customer": {
    "name": "ABC Corporation",
    "contact": {
      "name": "John Smith",
      "phone": "+1-555-0123",
      "email": "john@abc-corp.com"
    }
  },
  "address": {
    "street": "123 Business Ave",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "deliveryDate": "2024-01-15T10:00:00Z",
  "status": "scheduled"
}
```

## 🔍 Verification

### Check if Everything is Working

1. **Backend Health Check**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"status":"OK","message":"Logistics API is running"}`

2. **Frontend Access**
   - Open http://localhost:5173 in your browser
   - You should see the login page

3. **Database Connection**
   - Check backend console for "MongoDB connected successfully"
   - No connection errors should appear

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Kill process using port 5173
lsof -ti:5173 | xargs kill -9
```

#### MongoDB Connection Issues
- Verify connection string format
- Check username/password
- Ensure IP address is whitelisted in Atlas
- For local MongoDB, ensure service is running

#### Module Not Found Errors
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### CORS Issues
- Ensure backend is running on port 5000
- Check CORS configuration in `backend/server.js`
- Verify frontend is making requests to correct URL

### Environment Variable Issues

1. **Check if variables are loaded**
   ```javascript
   // In backend
   console.log('MongoDB URI:', process.env.MONGODB_URI);
   console.log('JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'Not set');
   ```

2. **Restart servers** after changing environment variables

### Database Issues

1. **Check MongoDB Atlas**
   - Verify cluster is running
   - Check database access permissions
   - Ensure network access is configured

2. **Local MongoDB**
   ```bash
   # Check if MongoDB is running
   ps aux | grep mongod

   # Check MongoDB logs
   tail -f /usr/local/var/log/mongodb/mongo.log
   ```

## 📞 Getting Help

If you encounter issues:

1. **Check the logs** in your terminal
2. **Verify environment variables** are set correctly
3. **Ensure all services are running**
4. **Check network connectivity** to MongoDB
5. **Review the troubleshooting section** above

## ✅ Next Steps

After successful setup:

1. **Create your first admin user**
2. **Add sample vehicles and drivers**
3. **Create test deliveries**
4. **Explore the dashboard and reports**
5. **Configure Google Maps** (optional)
6. **Set up production deployment** when ready

## 🔄 Development Workflow

1. **Make changes** to your code
2. **Test locally** with `npm run dev`
3. **Commit changes** to Git
4. **Deploy to production** when ready

The development servers support hot reloading, so changes will be reflected automatically.