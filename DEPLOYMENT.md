# Deployment Guide

This guide covers deploying the LogiTrack logistics management system to various hosting platforms.

## 🌐 Frontend Deployment

### Netlify (Recommended)

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect your Git repository for automatic deployments

3. **Environment Variables**
   - Add `VITE_API_URL` pointing to your backend URL
   - Add `VITE_GOOGLE_MAPS_API_KEY` if using maps

### Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Add environment variables in project settings

## 🖥 Backend Deployment

### Railway (Recommended)

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub repository
   - Select the backend folder

2. **Environment Variables**
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   PORT=5000
   ```

3. **Deploy**
   - Railway will automatically deploy on push

### Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your_connection_string
   heroku config:set JWT_SECRET=your_secret
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect your repository
   - Select backend folder

2. **Configure Build Settings**
   - Build Command: `npm install`
   - Run Command: `npm start`

3. **Environment Variables**
   - Add all required environment variables

## 🗄 Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster

2. **Create Database User**
   - Go to Database Access
   - Add a new database user

3. **Configure Network Access**
   - Go to Network Access
   - Add IP address (0.0.0.0/0 for all IPs)

4. **Get Connection String**
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string

## 🔧 Production Configuration

### Frontend Environment Variables

Create `.env.production` in frontend folder:
```env
VITE_API_URL=https://your-backend-url.com/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Backend Environment Variables

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/logistics?retryWrites=true&w=majority
JWT_SECRET=your_very_secure_jwt_secret_key
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-url.com
```

## 🚀 Full Stack Deployment

### Option 1: Separate Deployments
- Frontend: Netlify/Vercel
- Backend: Railway/Heroku
- Database: MongoDB Atlas

### Option 2: Single Platform
- Use platforms like Railway or DigitalOcean that support full-stack apps
- Deploy both frontend and backend to the same platform

## 📊 Performance Optimization

### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement code splitting
- Optimize images

### Backend
- Enable compression middleware
- Use connection pooling for MongoDB
- Implement caching (Redis)
- Use PM2 for process management

## 🔒 Security Checklist

- [ ] Use HTTPS for all connections
- [ ] Set secure JWT secret
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Set up proper firewall rules
- [ ] Use secure headers middleware

## 📈 Monitoring

### Frontend
- Google Analytics
- Sentry for error tracking
- Lighthouse for performance

### Backend
- Application monitoring (New Relic, DataDog)
- Database monitoring (MongoDB Atlas monitoring)
- Log aggregation (LogRocket, Papertrail)

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: cd frontend && npm install
      - name: Build
        run: cd frontend && npm run build
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=frontend/dist
        env:
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        uses: railway/cli@v1
        with:
          command: up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS configuration in backend
   - Ensure frontend URL is allowed

2. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check network access settings

3. **Environment Variables Not Loading**
   - Ensure variables are set in hosting platform
   - Check variable names (case sensitive)

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Health Checks

Add health check endpoints:

```javascript
// Backend health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

## 📞 Support

If you encounter issues during deployment:
1. Check the hosting platform's documentation
2. Review application logs
3. Test locally first
4. Check environment variables
5. Verify database connectivity