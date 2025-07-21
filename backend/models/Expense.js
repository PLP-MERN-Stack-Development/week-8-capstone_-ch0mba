import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['fuel', 'maintenance', 'repair', 'insurance', 'registration', 'tolls', 'parking', 'other'],
    required: true
  },
  category: {
    type: String,
    enum: ['vehicle', 'driver', 'general'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery'
  },
  receipt: {
    filename: String,
    url: String
  },
  mileage: Number,
  fuelDetails: {
    gallons: Number,
    pricePerGallon: Number,
    odometer: Number
  },
  vendor: {
    name: String,
    address: String,
    phone: String
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit-card', 'company-card', 'check'],
    default: 'company-card'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'reimbursed'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedDate: Date,
  notes: String
}, {
  timestamps: true
});

export default mongoose.model('Expense', expenseSchema);