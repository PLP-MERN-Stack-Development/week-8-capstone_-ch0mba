import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  weight: {
    type: Number,
    min: 0
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  inventory: {
    quantity: {
      type: Number,
      default: 0,
      min: 0
    },
    location: String,
    reorderLevel: {
      type: Number,
      default: 10
    }
  },
  supplier: {
    name: String,
    contact: String,
    phone: String,
    email: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  images: [String],
  barcode: String,
  sku: String
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);