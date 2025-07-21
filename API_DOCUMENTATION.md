# API Documentation

Complete API documentation for the LogiTrack Logistics Management System.

## 🔗 Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Flow

1. Register or login to get a JWT token
2. Include the token in subsequent requests
3. Token expires after 7 days

## 📋 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "staff" // optional: admin, manager, driver, staff
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ecb74b24a1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "staff"
  }
}
```

#### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ecb74b24a1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "staff"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "60d5ecb74b24a1234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "staff",
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

---

### Deliveries

#### Get All Deliveries
```http
GET /api/deliveries
```

**Query Parameters:**
- `status` (optional): Filter by status (scheduled, in-progress, completed, cancelled)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by delivery ID or customer name

**Example:**
```http
GET /api/deliveries?status=in-progress&page=1&limit=10&search=ABC
```

**Response:**
```json
{
  "deliveries": [
    {
      "_id": "60d5ecb74b24a1234567890",
      "deliveryId": "D-1001",
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
      "deliveryDate": "2024-01-15T10:00:00.000Z",
      "status": "scheduled",
      "driver": {
        "_id": "60d5ecb74b24a1234567891",
        "personalInfo": {
          "firstName": "Jane",
          "lastName": "Doe"
        }
      },
      "vehicle": {
        "_id": "60d5ecb74b24a1234567892",
        "vehicleId": "V-1001",
        "make": "Ford",
        "model": "Transit"
      },
      "products": [
        {
          "productId": "60d5ecb74b24a1234567893",
          "name": "Office Supplies",
          "quantity": 10,
          "price": 25.99
        }
      ],
      "totalAmount": 259.90,
      "createdAt": "2024-01-10T08:00:00.000Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

#### Get Single Delivery
```http
GET /api/deliveries/:id
```

**Response:**
```json
{
  "_id": "60d5ecb74b24a1234567890",
  "deliveryId": "D-1001",
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
    "zipCode": "10001",
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  },
  "deliveryDate": "2024-01-15T10:00:00.000Z",
  "timeWindow": {
    "start": "09:00",
    "end": "17:00"
  },
  "status": "scheduled",
  "driver": {
    "_id": "60d5ecb74b24a1234567891",
    "personalInfo": {
      "firstName": "Jane",
      "lastName": "Doe"
    },
    "employeeId": "EMP-1001"
  },
  "vehicle": {
    "_id": "60d5ecb74b24a1234567892",
    "vehicleId": "V-1001",
    "make": "Ford",
    "model": "Transit",
    "type": "van"
  },
  "products": [
    {
      "productId": "60d5ecb74b24a1234567893",
      "name": "Office Supplies",
      "quantity": 10,
      "price": 25.99
    }
  ],
  "notes": "Handle with care",
  "totalAmount": 259.90,
  "mileage": {
    "start": 15000,
    "end": 15025,
    "total": 25
  },
  "createdAt": "2024-01-10T08:00:00.000Z",
  "updatedAt": "2024-01-10T08:00:00.000Z"
}
```

#### Create Delivery
```http
POST /api/deliveries
```

**Request Body:**
```json
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
  "deliveryDate": "2024-01-15T10:00:00.000Z",
  "timeWindow": {
    "start": "09:00",
    "end": "17:00"
  },
  "driver": "60d5ecb74b24a1234567891",
  "vehicle": "60d5ecb74b24a1234567892",
  "products": [
    {
      "productId": "60d5ecb74b24a1234567893",
      "name": "Office Supplies",
      "quantity": 10,
      "price": 25.99
    }
  ],
  "notes": "Handle with care"
}
```

#### Update Delivery
```http
PUT /api/deliveries/:id
```

**Request Body:** (Same as create, all fields optional)

#### Delete Delivery
```http
DELETE /api/deliveries/:id
```

---

### Vehicles

#### Get All Vehicles
```http
GET /api/vehicles
```

**Query Parameters:**
- `status` (optional): available, in-use, maintenance, out-of-service
- `type` (optional): truck, van, car, motorcycle
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "vehicles": [
    {
      "_id": "60d5ecb74b24a1234567892",
      "vehicleId": "V-1001",
      "make": "Ford",
      "model": "Transit",
      "year": 2022,
      "licensePlate": "ABC-123",
      "vin": "1FTBW2CM5MKA12345",
      "type": "van",
      "capacity": {
        "weight": 3500,
        "volume": 400
      },
      "status": "available",
      "currentMileage": 15000,
      "fuelType": "gasoline",
      "fuelEfficiency": 18.5,
      "assignedDriver": {
        "_id": "60d5ecb74b24a1234567891",
        "personalInfo": {
          "firstName": "Jane",
          "lastName": "Doe"
        }
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 3,
  "currentPage": 1,
  "total": 25
}
```

#### Create Vehicle
```http
POST /api/vehicles
```

**Request Body:**
```json
{
  "make": "Ford",
  "model": "Transit",
  "year": 2022,
  "licensePlate": "ABC-123",
  "vin": "1FTBW2CM5MKA12345",
  "type": "van",
  "capacity": {
    "weight": 3500,
    "volume": 400
  },
  "fuelType": "gasoline",
  "fuelEfficiency": 18.5,
  "insurance": {
    "provider": "State Farm",
    "policyNumber": "SF123456789",
    "expirationDate": "2024-12-31T00:00:00.000Z"
  }
}
```

---

### Drivers

#### Get All Drivers
```http
GET /api/drivers
```

**Response:**
```json
{
  "drivers": [
    {
      "_id": "60d5ecb74b24a1234567891",
      "employeeId": "EMP-1001",
      "personalInfo": {
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane.doe@company.com",
        "phone": "+1-555-0124",
        "address": {
          "street": "456 Driver St",
          "city": "New York",
          "state": "NY",
          "zipCode": "10002"
        }
      },
      "license": {
        "number": "D123456789",
        "class": "CDL-A",
        "expirationDate": "2025-06-30T00:00:00.000Z",
        "endorsements": ["Hazmat", "Passenger"]
      },
      "employment": {
        "hireDate": "2023-01-15T00:00:00.000Z",
        "status": "active",
        "payRate": 25.50
      },
      "currentStatus": "available",
      "assignedVehicle": {
        "_id": "60d5ecb74b24a1234567892",
        "vehicleId": "V-1001",
        "make": "Ford",
        "model": "Transit"
      },
      "performance": {
        "totalDeliveries": 150,
        "onTimeDeliveries": 145,
        "rating": 4.8
      }
    }
  ]
}
```

#### Create Driver
```http
POST /api/drivers
```

**Request Body:**
```json
{
  "personalInfo": {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@company.com",
    "phone": "+1-555-0124",
    "address": {
      "street": "456 Driver St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10002"
    },
    "dateOfBirth": "1985-03-15T00:00:00.000Z",
    "emergencyContact": {
      "name": "John Doe",
      "phone": "+1-555-0125",
      "relationship": "Spouse"
    }
  },
  "license": {
    "number": "D123456789",
    "class": "CDL-A",
    "expirationDate": "2025-06-30T00:00:00.000Z",
    "endorsements": ["Hazmat", "Passenger"]
  },
  "employment": {
    "hireDate": "2023-01-15T00:00:00.000Z",
    "payRate": 25.50
  }
}
```

---

### Expenses

#### Get All Expenses
```http
GET /api/expenses
```

**Query Parameters:**
- `type` (optional): fuel, maintenance, repair, insurance, registration, tolls, parking, other
- `category` (optional): vehicle, driver, general
- `status` (optional): pending, approved, rejected, reimbursed
- `startDate` (optional): Filter from date (ISO format)
- `endDate` (optional): Filter to date (ISO format)

**Response:**
```json
{
  "expenses": [
    {
      "_id": "60d5ecb74b24a1234567894",
      "type": "fuel",
      "category": "vehicle",
      "amount": 75.50,
      "description": "Fuel for delivery route",
      "date": "2024-01-15T14:30:00.000Z",
      "vehicle": {
        "_id": "60d5ecb74b24a1234567892",
        "vehicleId": "V-1001",
        "make": "Ford",
        "model": "Transit"
      },
      "driver": {
        "_id": "60d5ecb74b24a1234567891",
        "personalInfo": {
          "firstName": "Jane",
          "lastName": "Doe"
        }
      },
      "fuelDetails": {
        "gallons": 15.2,
        "pricePerGallon": 4.97,
        "odometer": 15025
      },
      "vendor": {
        "name": "Shell Gas Station",
        "address": "789 Main St, New York, NY"
      },
      "paymentMethod": "company-card",
      "status": "approved"
    }
  ]
}
```

#### Create Expense
```http
POST /api/expenses
```

**Request Body:**
```json
{
  "type": "fuel",
  "category": "vehicle",
  "amount": 75.50,
  "description": "Fuel for delivery route",
  "date": "2024-01-15T14:30:00.000Z",
  "vehicle": "60d5ecb74b24a1234567892",
  "driver": "60d5ecb74b24a1234567891",
  "fuelDetails": {
    "gallons": 15.2,
    "pricePerGallon": 4.97,
    "odometer": 15025
  },
  "vendor": {
    "name": "Shell Gas Station",
    "address": "789 Main St, New York, NY",
    "phone": "+1-555-0199"
  },
  "paymentMethod": "company-card"
}
```

---

### Products

#### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search by name, ID, or description
- `lowStock` (optional): true to show only low stock items

**Response:**
```json
{
  "products": [
    {
      "_id": "60d5ecb74b24a1234567893",
      "productId": "P-1001",
      "name": "Office Supplies",
      "description": "Basic office supplies package",
      "category": "Office Equipment",
      "price": 25.99,
      "weight": 2.5,
      "dimensions": {
        "length": 12,
        "width": 8,
        "height": 6
      },
      "inventory": {
        "quantity": 150,
        "location": "Warehouse A",
        "reorderLevel": 20
      },
      "supplier": {
        "name": "Office Depot",
        "contact": "John Smith",
        "phone": "+1-555-0150",
        "email": "orders@officedepot.com"
      },
      "isActive": true,
      "barcode": "123456789012",
      "sku": "OS-001"
    }
  ]
}
```

#### Create Product
```http
POST /api/products
```

**Request Body:**
```json
{
  "name": "Office Supplies",
  "description": "Basic office supplies package",
  "category": "Office Equipment",
  "price": 25.99,
  "weight": 2.5,
  "dimensions": {
    "length": 12,
    "width": 8,
    "height": 6
  },
  "inventory": {
    "quantity": 150,
    "location": "Warehouse A",
    "reorderLevel": 20
  },
  "supplier": {
    "name": "Office Depot",
    "contact": "John Smith",
    "phone": "+1-555-0150",
    "email": "orders@officedepot.com"
  },
  "barcode": "123456789012",
  "sku": "OS-001"
}
```

---

### Reports

#### Dashboard Statistics
```http
GET /api/reports/dashboard
```

**Response:**
```json
{
  "deliveries": {
    "total": 1250,
    "active": 45,
    "completedThisMonth": 180
  },
  "vehicles": {
    "total": 25,
    "available": 18,
    "inMaintenance": 2
  },
  "drivers": {
    "total": 30,
    "onDuty": 12
  },
  "expenses": {
    "monthlyTotal": 15750.50,
    "byType": [
      {
        "_id": "fuel",
        "total": 8500.25
      },
      {
        "_id": "maintenance",
        "total": 3250.75
      }
    ]
  }
}
```

#### Delivery Performance Report
```http
GET /api/reports/delivery-performance?startDate=2024-01-01&endDate=2024-01-31
```

#### Vehicle Utilization Report
```http
GET /api/reports/vehicle-utilization?startDate=2024-01-01&endDate=2024-01-31
```

#### Expense Analysis Report
```http
GET /api/reports/expense-analysis?startDate=2024-01-01&endDate=2024-01-31
```

---

## 🚨 Error Responses

### Standard Error Format
```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

### Common Error Messages

#### Authentication Errors
```json
{
  "message": "No token, authorization denied"
}
```

```json
{
  "message": "Token is not valid"
}
```

#### Validation Errors
```json
{
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

#### Not Found Errors
```json
{
  "message": "Delivery not found"
}
```

## 📝 Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints**: 5 requests per minute per IP
- **General endpoints**: 100 requests per minute per user
- **File upload endpoints**: 10 requests per minute per user

## 🔒 Security Headers

All API responses include security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

## 📊 Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response Format:**
```json
{
  "data": [...],
  "totalPages": 10,
  "currentPage": 1,
  "total": 100
}
```

## 🔍 Filtering and Searching

Most list endpoints support filtering and searching:

**Common Query Parameters:**
- `search`: Text search across relevant fields
- `status`: Filter by status
- `startDate`/`endDate`: Date range filtering
- `sortBy`: Field to sort by
- `sortOrder`: `asc` or `desc`

**Example:**
```http
GET /api/deliveries?search=ABC&status=completed&sortBy=deliveryDate&sortOrder=desc
```