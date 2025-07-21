import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  personalInfo: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    dateOfBirth: Date,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  license: {
    number: {
      type: String,
      required: true,
      unique: true
    },
    class: {
      type: String,
      required: true
    },
    expirationDate: {
      type: Date,
      required: true
    },
    endorsements: [String]
  },
  employment: {
    hireDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on-leave', 'terminated'],
      default: 'active'
    },
    payRate: Number,
    workingHours: {
      maxDaily: {
        type: Number,
        default: 8
      },
      maxWeekly: {
        type: Number,
        default: 40
      }
    }
  },
  currentStatus: {
    type: String,
    enum: ['available', 'on-duty', 'off-duty', 'break'],
    default: 'off-duty'
  },
  assignedVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    default: null
  },
  currentLocation: {
    lat: Number,
    lng: Number,
    lastUpdated: Date
  },
  hoursWorked: {
    today: {
      type: Number,
      default: 0
    },
    thisWeek: {
      type: Number,
      default: 0
    }
  },
  performance: {
    totalDeliveries: {
      type: Number,
      default: 0
    },
    onTimeDeliveries: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    }
  }
}, {
  timestamps: true
});

// Virtual for full name
driverSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

export default mongoose.model('Driver', driverSchema);