import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const deliverySchema = new mongoose.Schema({
  deliveryId: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: {
      type: String,
      required: true
    },
    contact: {
      name: String,
      phone: String,
      email: String
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  timeWindow: {
    start: String,
    end: String
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'delayed'],
    default: 'scheduled'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  products: [productSchema],
  notes: String,
  totalAmount: {
    type: Number,
    default: 0
  },
  actualDeliveryTime: Date,
  signature: String,
  photos: [String],
  mileage: {
    start: Number,
    end: Number,
    total: Number
  }
}, {
  timestamps: true
});

// Calculate total amount before saving
deliverySchema.pre('save', function(next) {
  this.totalAmount = this.products.reduce((total, product) => {
    return total + (product.quantity * product.price);
  }, 0);
  next();
});

export default mongoose.model('Delivery', deliverySchema);