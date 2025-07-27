import { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Calendar, Download, 
  Truck, DollarSign, Users, Car, Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Reports = () => {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [reportType, setReportType] = useState('overview');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Mock data for demonstration
  const overviewData = {
    totalDeliveries: 1250,
    completedDeliveries: 1180,
    totalRevenue: 125000,
    totalExpenses: 45000,
    activeVehicles: 25,
    activeDrivers: 30,
    averageDeliveryTime: 2.5,
    onTimeDeliveryRate: 94.4
  };

  const deliveryPerformance = [
    { month: 'Jan', completed: 180, scheduled: 200, cancelled: 15 },
    { month: 'Feb', completed: 165, scheduled: 185, cancelled: 12 },
    { month: 'Mar', completed: 195, scheduled: 210, cancelled: 8 },
    { month: 'Apr', completed: 220, scheduled: 235, cancelled: 10 },
    { month: 'May', completed: 210, scheduled: 225, cancelled: 5 },
    { month: 'Jun', completed: 210, scheduled: 220, cancelled: 7 }
  ];

  const expenseBreakdown = [
    { category: 'Fuel', amount: 18500, percentage: 41.1 },
    { category: 'Maintenance', amount: 12000, percentage: 26.7 },
    { category: 'Repairs', amount: 8500, percentage: 18.9 },
    { category: 'Insurance', amount: 4000, percentage: 8.9 },
    { category: 'Other', amount: 2000, percentage: 4.4 }
  ];

  const topDrivers = [
    { name: 'John Doe', deliveries: 85, onTimeRate: 98.8, rating: 4.9 },
    { name: 'Jane Smith', deliveries: 82, onTimeRate: 97.6, rating: 4.8 },
    { name: 'Mike Johnson', deliveries: 78, onTimeRate: 96.2, rating: 4.7 },
    { name: 'Sarah Wilson', deliveries: 75, onTimeRate: 95.8, rating: 4.6 },
    { name: 'Tom Brown', deliveries: 72, onTimeRate: 94.4, rating: 4.5 }
  ];

  const vehicleUtilization = [
    { vehicle: 'V-1001', utilization: 92, mileage: 2500, deliveries: 45 },
    { vehicle: 'V-1002', utilization: 88, mileage: 2200, deliveries: 42 },
    { vehicle: 'V-1003', utilization: 85, mileage: 2100, deliveries: 38 },
    { vehicle: 'V-1004', utilization: 82, mileage: 1950, deliveries: 35 },
    { vehicle: 'V-1005', utilization: 78, mileage: 1800, deliveries: 32 }
  ];

  const handleExport = (format) => {
    // In a real app, this would generate and download the report
    console.log(`Exporting ${reportType} report as ${format}`);
  };

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp size={14} className="mr-1" />
                {Math.abs(trend)}% {trend > 0 ? 'increase' : 'decrease'}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download size={16} className="mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download size={16} className="mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="deliveries">Delivery Performance</SelectItem>
                  <SelectItem value="expenses">Expense Analysis</SelectItem>
                  <SelectItem value="vehicles">Vehicle Utilization</SelectItem>
                  <SelectItem value="drivers">Driver Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dateRange === 'custom' && (
              <>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Overview Dashboard */}
      {reportType === 'overview' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Deliveries" 
              value={overviewData.totalDeliveries.toLocaleString()} 
              icon={Truck}
              trend={8.2}
              color="bg-blue-600"
            />
            <StatCard 
              title="Total Revenue" 
              value={`$${overviewData.totalRevenue.toLocaleString()}`} 
              icon={DollarSign}
              trend={12.5}
              color="bg-green-600"
            />
            <StatCard 
              title="Active Vehicles" 
              value={overviewData.activeVehicles} 
              icon={Car}
              color="bg-orange-600"
            />
            <StatCard 
              title="Active Drivers" 
              value={overviewData.activeDrivers} 
              icon={Users}
              color="bg-purple-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Completion Rate</span>
                    <span className="text-sm font-bold">
                      {((overviewData.completedDeliveries / overviewData.totalDeliveries) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(overviewData.completedDeliveries / overviewData.totalDeliveries) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">On-Time Delivery Rate</span>
                    <span className="text-sm font-bold">{overviewData.onTimeDeliveryRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${overviewData.onTimeDeliveryRate}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Delivery Time</span>
                    <span className="text-sm font-bold">{overviewData.averageDeliveryTime} hours</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Profit Margin</span>
                    <span className="text-sm font-bold">
                      {(((overviewData.totalRevenue - overviewData.totalExpenses) / overviewData.totalRevenue) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Delivery Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {deliveryPerformance.map((month, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '200px' }}>
                        <div 
                          className="bg-green-500 rounded-t absolute bottom-0 w-full"
                          style={{ height: `${(month.completed / 250) * 100}%` }}
                        ></div>
                        <div 
                          className="bg-blue-500 absolute bottom-0 w-full opacity-50"
                          style={{ height: `${(month.scheduled / 250) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs mt-2 font-medium">{month.month}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center space-x-4 mt-4 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                    <span>Completed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 opacity-50 rounded mr-1"></div>
                    <span>Scheduled</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Expense Analysis */}
      {reportType === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseBreakdown.map((expense, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}></div>
                      <span className="font-medium">{expense.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${expense.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{expense.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Expense Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 size={48} className="mx-auto mb-2" />
                  <p>Expense trend chart would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Driver Performance */}
      {reportType === 'drivers' && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Driver</th>
                    <th className="text-right py-2">Deliveries</th>
                    <th className="text-right py-2">On-Time Rate</th>
                    <th className="text-right py-2">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {topDrivers.map((driver, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 font-medium">{driver.name}</td>
                      <td className="text-right py-3">{driver.deliveries}</td>
                      <td className="text-right py-3">{driver.onTimeRate}%</td>
                      <td className="text-right py-3">{driver.rating}/5.0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vehicle Utilization */}
      {reportType === 'vehicles' && (
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Utilization Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Vehicle ID</th>
                    <th className="text-right py-2">Utilization</th>
                    <th className="text-right py-2">Mileage</th>
                    <th className="text-right py-2">Deliveries</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleUtilization.map((vehicle, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 font-medium">{vehicle.vehicle}</td>
                      <td className="text-right py-3">
                        <div className="flex items-center justify-end space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${vehicle.utilization}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{vehicle.utilization}%</span>
                        </div>
                      </td>
                      <td className="text-right py-3">{vehicle.mileage.toLocaleString()} mi</td>
                      <td className="text-right py-3">{vehicle.deliveries}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Performance */}
      {reportType === 'deliveries' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Completed</span>
                  <span className="font-bold text-green-600">1,180 (94.4%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">In Progress</span>
                  <span className="font-bold text-blue-600">45 (3.6%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Cancelled</span>
                  <span className="font-bold text-red-600">25 (2.0%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Delivery Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Average Delivery Time</span>
                  <span className="font-bold">2.5 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Average Distance</span>
                  <span className="font-bold">15.2 miles</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Average Revenue per Delivery</span>
                  <span className="font-bold">$100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Customer Satisfaction</span>
                  <span className="font-bold">4.7/5.0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Reports;