# LogiTrack - Logistics Management System

A comprehensive MERN stack application for managing logistics operations including deliveries, vehicles, drivers, expenses, and inventory.

## 🚀 Features

- **Dashboard**: Real-time metrics and activity monitoring
- **Delivery Management**: Complete delivery lifecycle tracking
- **Fleet Management**: Vehicle tracking with maintenance records
- **Driver Management**: Employee records and performance tracking
- **Expense Tracking**: Comprehensive expense management with categorization
- **Inventory Management**: Product tracking with low-stock alerts
- **Reporting & Analytics**: Performance insights and data visualization
- **Mileage Tracking**: Integrated mileage calculation for deliveries
- **Google Maps Integration**: Route optimization and mapping (ready to implement)

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **CORS** enabled for cross-origin requests

## 📁 Project Structure

```
logistics-management-system/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js backend API
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   └── package.json        # Backend dependencies
└── package.json            # Root package.json for scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd logistics-management-system
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `.env` file with your MongoDB Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/logistics?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   PORT=5000
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 🗄 Database Setup

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Add your connection string to the `.env` file

### Local MongoDB (Alternative)
If you prefer local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/logistics
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Deliveries
- `GET /api/deliveries` - Get all deliveries
- `POST /api/deliveries` - Create new delivery
- `GET /api/deliveries/:id` - Get delivery by ID
- `PUT /api/deliveries/:id` - Update delivery
- `DELETE /api/deliveries/:id` - Delete delivery

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Create new vehicle
- `GET /api/vehicles/:id` - Get vehicle by ID
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Drivers
- `GET /api/drivers` - Get all drivers
- `POST /api/drivers` - Create new driver
- `GET /api/drivers/:id` - Get driver by ID
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get expense by ID
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Reports
- `GET /api/reports/dashboard` - Dashboard statistics
- `GET /api/reports/delivery-performance` - Delivery performance metrics
- `GET /api/reports/vehicle-utilization` - Vehicle utilization data
- `GET /api/reports/expense-analysis` - Expense analysis

## 🎨 UI Components

The application uses shadcn/ui components for a consistent and professional interface:

- **Cards**: For displaying information blocks
- **Buttons**: Various button styles and sizes
- **Forms**: Input fields, selects, and labels
- **Navigation**: Sidebar and top navigation
- **Toasts**: For user notifications
- **Tables**: For data display
- **Charts**: For analytics (ready to implement)

## 🔧 Development Scripts

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Start both frontend and backend in development mode
npm run dev

# Start only frontend
npm run dev:frontend

# Start only backend
npm run dev:backend

# Build frontend for production
npm run build
```

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `dist` folder to your hosting service

### Backend (Heroku/Railway/DigitalOcean)
1. Set environment variables on your hosting platform
2. Deploy the `backend` folder
3. Update the frontend API URL in `frontend/src/lib/utils.js`

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Protected API routes
- Role-based access control (ready to implement)

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Different screen orientations

## 🗺 Google Maps Integration

To enable Google Maps features:

1. Get a Google Maps API key from Google Cloud Console
2. Add the API key to your environment variables:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Directions API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔄 Future Enhancements

- Real-time notifications
- Advanced reporting with charts
- Mobile app (React Native)
- GPS tracking integration
- Automated route optimization
- Invoice generation
- Multi-tenant support
- Advanced user roles and permissions

---

**Built with ❤️ using the MERN stack**