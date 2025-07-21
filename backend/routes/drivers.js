import express from 'express';
import { body, validationResult } from 'express-validator';
import Driver from '../models/Driver.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all drivers
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query['employment.status'] = status;
    }

    const drivers = await Driver.find(query)
      .populate('assignedVehicle', 'vehicleId make model')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Driver.countDocuments(query);

    res.json({
      drivers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single driver
router.get('/:id', auth, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .populate('assignedVehicle', 'vehicleId make model type');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    console.error('Get driver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create driver
router.post('/', [
  auth,
  body('personalInfo.firstName').notEmpty().withMessage('First name is required'),
  body('personalInfo.lastName').notEmpty().withMessage('Last name is required'),
  body('personalInfo.email').isEmail().withMessage('Valid email is required'),
  body('personalInfo.phone').notEmpty().withMessage('Phone number is required'),
  body('license.number').notEmpty().withMessage('License number is required'),
  body('license.class').notEmpty().withMessage('License class is required'),
  body('license.expirationDate').isISO8601().withMessage('Valid license expiration date is required'),
  body('employment.hireDate').isISO8601().withMessage('Valid hire date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Generate employee ID
    const count = await Driver.countDocuments();
    const employeeId = `EMP-${String(count + 1001).padStart(4, '0')}`;

    const driver = new Driver({
      ...req.body,
      employeeId
    });

    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    console.error('Create driver error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Driver with this email or license number already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update driver
router.put('/:id', auth, async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedVehicle', 'vehicleId make model');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    console.error('Update driver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete driver
router.delete('/:id', auth, async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Delete driver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;