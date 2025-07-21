import express from 'express';
import { body, validationResult } from 'express-validator';
import Expense from '../models/Expense.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all expenses
router.get('/', auth, async (req, res) => {
  try {
    const { type, category, status, page = 1, limit = 10, startDate, endDate } = req.query;
    
    let query = {};
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const expenses = await Expense.find(query)
      .populate('vehicle', 'vehicleId make model')
      .populate('driver', 'personalInfo.firstName personalInfo.lastName')
      .populate('delivery', 'deliveryId')
      .populate('approvedBy', 'name')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Expense.countDocuments(query);

    res.json({
      expenses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single expense
router.get('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('vehicle', 'vehicleId make model')
      .populate('driver', 'personalInfo employeeId')
      .populate('delivery', 'deliveryId')
      .populate('approvedBy', 'name');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create expense
router.post('/', [
  auth,
  body('type').isIn(['fuel', 'maintenance', 'repair', 'insurance', 'registration', 'tolls', 'parking', 'other']).withMessage('Valid expense type is required'),
  body('category').isIn(['vehicle', 'driver', 'general']).withMessage('Valid category is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Valid amount is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const expense = new Expense(req.body);
    await expense.save();
    
    const populatedExpense = await Expense.findById(expense._id)
      .populate('vehicle', 'vehicleId make model')
      .populate('driver', 'personalInfo.firstName personalInfo.lastName')
      .populate('delivery', 'deliveryId');

    res.status(201).json(populatedExpense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('vehicle', 'vehicleId make model')
    .populate('driver', 'personalInfo.firstName personalInfo.lastName')
    .populate('delivery', 'deliveryId');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;