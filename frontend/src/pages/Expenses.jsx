import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Filter, DollarSign, Receipt, Fuel, 
  Wrench, Calendar, TrendingUp, Edit, Trash2, FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

const ExpensesList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for demonstration
  const mockExpenses = [
    {
      _id: '1',
      type: 'fuel',
      category: 'vehicle',
      amount: 125.50,
      description: 'Fuel for delivery route - Downtown area',
      date: '2024-01-15',
      vehicle: {
        vehicleId: 'V-1001',
        make: 'Ford',
        model: 'Transit'
      },
      driver: {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe'
        }
      },
      fuelDetails: {
        gallons: 25.2,
        pricePerGallon: 4.98,
        odometer: 15025
      },
      vendor: {
        name: 'Shell Gas Station',
        address: '123 Main St, New York, NY'
      },
      paymentMethod: 'company-card',
      status: 'approved'
    },
    {
      _id: '2',
      type: 'maintenance',
      category: 'vehicle',
      amount: 450.00,
      description: 'Oil change and tire rotation',
      date: '2024-01-12',
      vehicle: {
        vehicleId: 'V-1002',
        make: 'Mercedes',
        model: 'Sprinter'
      },
      driver: null,
      vendor: {
        name: 'Quick Lube Service',
        address: '456 Service Rd, Chicago, IL'
      },
      paymentMethod: 'company-card',
      status: 'pending'
    },
    {
      _id: '3',
      type: 'repair',
      category: 'vehicle',
      amount: 850.75,
      description: 'Brake pad replacement and rotor resurfacing',
      date: '2024-01-10',
      vehicle: {
        vehicleId: 'V-1003',
        make: 'Isuzu',
        model: 'NPR'
      },
      driver: null,
      vendor: {
        name: 'Metro Auto Repair',
        address: '789 Repair Ave, Boston, MA'
      },
      paymentMethod: 'check',
      status: 'approved'
    },
    {
      _id: '4',
      type: 'tolls',
      category: 'driver',
      amount: 15.25,
      description: 'Highway tolls for delivery route',
      date: '2024-01-14',
      vehicle: {
        vehicleId: 'V-1001',
        make: 'Ford',
        model: 'Transit'
      },
      driver: {
        personalInfo: {
          firstName: 'Jane',
          lastName: 'Smith'
        }
      },
      paymentMethod: 'cash',
      status: 'reimbursed'
    }
  ];

  useEffect(() => {
    setExpenses(mockExpenses);
    setLoading(false);
  }, []);

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vehicle?.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vendor?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || expense.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type) => {
    const icons = {
      fuel: Fuel,
      maintenance: Wrench,
      repair: Wrench,
      insurance: FileText,
      registration: FileText,
      tolls: DollarSign,
      parking: DollarSign,
      other: Receipt
    };
    return icons[type] || Receipt;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        className: 'bg-yellow-100 text-yellow-800',
        label: 'Pending'
      },
      approved: {
        className: 'bg-green-100 text-green-800',
        label: 'Approved'
      },
      rejected: {
        className: 'bg-red-100 text-red-800',
        label: 'Rejected'
      },
      reimbursed: {
        className: 'bg-blue-100 text-blue-800',
        label: 'Reimbursed'
      }
    };

    const config = statusConfig[status];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        setExpenses(expenses.filter(e => e._id !== expenseId));
        toast({
          title: "Success",
          description: "Expense deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete expense",
          variant: "destructive",
        });
      }
    }
  };

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-muted-foreground">
            Total: ${totalExpenses.toFixed(2)} ({filteredExpenses.length} expenses)
          </p>
        </div>
        <Button onClick={() => navigate('/expenses/new')}>
          <Plus size={16} className="mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search expenses..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sm:w-48">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <Filter size={18} className="mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="fuel">Fuel</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="repair">Repair</SelectItem>
              <SelectItem value="insurance">Insurance</SelectItem>
              <SelectItem value="tolls">Tolls</SelectItem>
              <SelectItem value="parking">Parking</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="reimbursed">Reimbursed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Expenses list */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {filteredExpenses.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-muted-foreground">No expenses found matching your criteria.</p>
              </div>
            ) : (
              filteredExpenses.map((expense) => {
                const TypeIcon = getTypeIcon(expense.type);
                return (
                  <div 
                    key={expense._id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-blue-100">
                          <TypeIcon size={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <p className="text-lg font-semibold text-gray-900">
                              ${expense.amount.toFixed(2)}
                            </p>
                            <span className="text-sm text-muted-foreground capitalize">
                              {expense.type}
                            </span>
                            {getStatusBadge(expense.status)}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{expense.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              {new Date(expense.date).toLocaleDateString()}
                            </div>
                            {expense.vehicle && (
                              <div>
                                Vehicle: {expense.vehicle.vehicleId}
                              </div>
                            )}
                            {expense.driver && (
                              <div>
                                Driver: {expense.driver.personalInfo.firstName} {expense.driver.personalInfo.lastName}
                              </div>
                            )}
                            <div>
                              Payment: {expense.paymentMethod.replace('-', ' ')}
                            </div>
                          </div>
                          {expense.vendor && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Vendor: {expense.vendor.name}
                            </p>
                          )}
                          {expense.fuelDetails && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {expense.fuelDetails.gallons} gallons @ ${expense.fuelDetails.pricePerGallon}/gal
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/expenses/${expense._id}/edit`)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(expense._id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ExpenseForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: 'fuel',
    category: 'vehicle',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    vehicle: '',
    driver: '',
    fuelDetails: {
      gallons: '',
      pricePerGallon: '',
      odometer: ''
    },
    vendor: {
      name: '',
      address: '',
      phone: ''
    },
    paymentMethod: 'company-card',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call would go here
      toast({
        title: "Success",
        description: `Expense ${isEdit ? 'updated' : 'created'} successfully`,
      });
      navigate('/expenses');
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? 'update' : 'create'} expense`,
        variant: "destructive",
      });
    }
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/expenses')}>
          ← Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Expense' : 'Add New Expense'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Expense Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fuel">Fuel</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="registration">Registration</SelectItem>
                    <SelectItem value="tolls">Tolls</SelectItem>
                    <SelectItem value="parking">Parking</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => handleChange('paymentMethod', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="company-card">Company Card</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                required
              />
            </div>

            {/* Fuel Details (show only for fuel expenses) */}
            {formData.type === 'fuel' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Fuel Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="gallons">Gallons</Label>
                    <Input
                      id="gallons"
                      type="number"
                      step="0.1"
                      value={formData.fuelDetails.gallons}
                      onChange={(e) => handleChange('fuelDetails.gallons', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricePerGallon">Price per Gallon</Label>
                    <Input
                      id="pricePerGallon"
                      type="number"
                      step="0.001"
                      value={formData.fuelDetails.pricePerGallon}
                      onChange={(e) => handleChange('fuelDetails.pricePerGallon', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="odometer">Odometer Reading</Label>
                    <Input
                      id="odometer"
                      type="number"
                      value={formData.fuelDetails.odometer}
                      onChange={(e) => handleChange('fuelDetails.odometer', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Vendor Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vendor Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="vendorName">Vendor Name</Label>
                  <Input
                    id="vendorName"
                    value={formData.vendor.name}
                    onChange={(e) => handleChange('vendor.name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendorPhone">Vendor Phone</Label>
                  <Input
                    id="vendorPhone"
                    value={formData.vendor.phone}
                    onChange={(e) => handleChange('vendor.phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="vendorAddress">Vendor Address</Label>
                  <Input
                    id="vendorAddress"
                    value={formData.vendor.address}
                    onChange={(e) => handleChange('vendor.address', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit">
                {isEdit ? 'Update Expense' : 'Create Expense'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/expenses')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const Expenses = () => {
  return (
    <Routes>
      <Route path="/" element={<ExpensesList />} />
      <Route path="/new" element={<ExpenseForm />} />
      <Route path="/:id/edit" element={<ExpenseForm isEdit={true} />} />
    </Routes>
  );
};

export default Expenses;