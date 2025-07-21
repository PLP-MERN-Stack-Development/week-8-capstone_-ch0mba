import express from 'express';
import { body, validationResult } from 'express-validator';
import Delivery from '../models/Delivery.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all deliveries
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { deliveryId: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } }
      ];
    }

    const deliveries = await Delivery.find(query)
      .populate('driver', 'personalInfo.firstName personalInfo.lastName')
      .populate('vehicle', 'vehicleId make model')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Delivery.countDocuments(query);

    res.json({
      deliveries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get deliveries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single delivery
router.get('/:id', auth, async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('driver', 'personalInfo employeeId')
      .populate('vehicle', 'vehicleId make model type');

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.json(delivery);
  } catch (error) {
    console.error('Get delivery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create delivery
router.post('/', [
  auth,
  body('customer.name').notEmpty().withMessage('Customer name is required'),
  body('deliveryDate').isISO8601().withMessage('Valid delivery date is required'),
  body('driver').isMongoId().withMessage('Valid driver ID is required'),
  body('vehicle').isMongoId().withMessage('Valid vehicle ID is required'),
  body('products').isArray({ min: 1 }).withMessage('At least one product is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Generate delivery ID
    const count = await Delivery.countDocuments();
    const deliveryId = `D-${String(count + 1001).padStart(4, '0')}`;

    const delivery = new Delivery({
      ...req.body,
      deliveryId
    });

    await delivery.save();
    
    const populatedDelivery = await Delivery.findById(delivery._id)
      .populate('driver', 'personalInfo.firstName personalInfo.lastName')
      .populate('vehicle', 'vehicleId make model');

    res.status(201).json(populatedDelivery);
  } catch (error) {
    console.error('Create delivery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update delivery
router.put('/:id', auth, async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('driver', 'personalInfo.firstName personalInfo.lastName')
    .populate('vehicle', 'vehicleId make model');

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.json(delivery);
  } catch (error) {
    console.error('Update delivery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete delivery
router.delete('/:id', auth, async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.json({ message: 'Delivery deleted successfully' });
  } catch (error) {
    console.error('Delete delivery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;