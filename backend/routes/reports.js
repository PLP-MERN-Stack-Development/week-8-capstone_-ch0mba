import express from 'express';
import Delivery from '../models/Delivery.js';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import Expense from '../models/Expense.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Dashboard statistics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    // Delivery statistics
    const totalDeliveries = await Delivery.countDocuments();
    const activeDeliveries = await Delivery.countDocuments({ status: 'in-progress' });
    const completedThisMonth = await Delivery.countDocuments({
      status: 'completed',
      createdAt: { $gte: startOfMonth }
    });

    // Vehicle statistics
    const totalVehicles = await Vehicle.countDocuments();
    const availableVehicles = await Vehicle.countDocuments({ status: 'available' });
    const vehiclesInMaintenance = await Vehicle.countDocuments({ status: 'maintenance' });

    // Driver statistics
    const totalDrivers = await Driver.countDocuments({ 'employment.status': 'active' });
    const driversOnDuty = await Driver.countDocuments({ currentStatus: 'on-duty' });

    // Expense statistics
    const monthlyExpenses = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const expensesByType = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      deliveries: {
        total: totalDeliveries,
        active: activeDeliveries,
        completedThisMonth
      },
      vehicles: {
        total: totalVehicles,
        available: availableVehicles,
        inMaintenance: vehiclesInMaintenance
      },
      drivers: {
        total: totalDrivers,
        onDuty: driversOnDuty
      },
      expenses: {
        monthlyTotal: monthlyExpenses[0]?.total || 0,
        byType: expensesByType
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delivery performance report
router.get('/delivery-performance', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        deliveryDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    const deliveryStats = await Delivery.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const driverPerformance = await Delivery.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      {
        $lookup: {
          from: 'drivers',
          localField: 'driver',
          foreignField: '_id',
          as: 'driverInfo'
        }
      },
      { $unwind: '$driverInfo' },
      {
        $group: {
          _id: '$driver',
          driverName: { $first: { $concat: ['$driverInfo.personalInfo.firstName', ' ', '$driverInfo.personalInfo.lastName'] } },
          totalDeliveries: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { totalDeliveries: -1 } }
    ]);

    res.json({
      deliveryStats,
      driverPerformance
    });
  } catch (error) {
    console.error('Delivery performance report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Vehicle utilization report
router.get('/vehicle-utilization', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        deliveryDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    const vehicleUtilization = await Delivery.aggregate([
      { $match: dateFilter },
      {
        $lookup: {
          from: 'vehicles',
          localField: 'vehicle',
          foreignField: '_id',
          as: 'vehicleInfo'
        }
      },
      { $unwind: '$vehicleInfo' },
      {
        $group: {
          _id: '$vehicle',
          vehicleId: { $first: '$vehicleInfo.vehicleId' },
          make: { $first: '$vehicleInfo.make' },
          model: { $first: '$vehicleInfo.model' },
          totalDeliveries: { $sum: 1 },
          totalMileage: { $sum: '$mileage.total' }
        }
      },
      { $sort: { totalDeliveries: -1 } }
    ]);

    res.json({ vehicleUtilization });
  } catch (error) {
    console.error('Vehicle utilization report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Expense analysis report
router.get('/expense-analysis', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    const expensesByCategory = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const expensesByType = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyTrend = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      expensesByCategory,
      expensesByType,
      monthlyTrend
    });
  } catch (error) {
    console.error('Expense analysis report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;