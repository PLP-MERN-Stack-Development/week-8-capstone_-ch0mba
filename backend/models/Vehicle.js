import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  description: String,
  cost: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  mileage: Number,
  nextServiceMileage: Number
});

const vehicleSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
    unique: true
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true
  },
  vin: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['truck', 'van', 'car', 'motorcycle'],
    required: true
  },
  capacity: {
    weight: Number, // in pounds
    volume: Number  // in cubic feet
  },
  status: {
    type: String,
    enum: ['available', 'in-use', 'maintenance', 'out-of-service'],
    default: 'available'
  },
  currentMileage: {
    type: Number,
    default: 0
  },
  fuelType: {
    type: String,
    enum: ['gasoline', 'diesel', 'electric', 'hybrid'],
    required: true
  },
  fuelEfficiency: Number, // miles per gallon
  insurance: {
    provider: String,
    policyNumber: String,
    expirationDate: Date
  },
  registration: {
    expirationDate: Date
  },
  maintenanceHistory: [maintenanceSchema],
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('Vehicle', vehicleSchema);