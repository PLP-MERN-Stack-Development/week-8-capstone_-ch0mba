import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Filter, User, Phone, Mail, MapPin, 
  Calendar, Award, Clock, Edit, Trash2, Car
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

const DriversList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for demonstration
  const mockDrivers = [
    {
      _id: '1',
      employeeId: 'EMP-1001',
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1-555-0123',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        }
      },
      license: {
        number: 'D123456789',
        class: 'CDL-A',
        expirationDate: '2025-06-30'
      },
      employment: {
        hireDate: '2023-01-15',
        status: 'active',
        payRate: 25.50
      },
      currentStatus: 'available',
      assignedVehicle: {
        vehicleId: 'V-1001',
        make: 'Ford',
        model: 'Transit'
      },
      performance: {
        totalDeliveries: 150,
        onTimeDeliveries: 145,
        rating: 4.8
      }
    },
    {
      _id: '2',
      employeeId: 'EMP-1002',
      personalInfo: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        phone: '+1-555-0124',
        address: {
          street: '456 Oak Ave',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60007'
        }
      },
      license: {
        number: 'D987654321',
        class: 'CDL-B',
        expirationDate: '2024-12-15'
      },
      employment: {
        hireDate: '2022-08-20',
        status: 'active',
        payRate: 28.00
      },
      currentStatus: 'on-duty',
      assignedVehicle: {
        vehicleId: 'V-1002',
        make: 'Mercedes',
        model: 'Sprinter'
      },
      performance: {
        totalDeliveries: 280,
        onTimeDeliveries: 275,
        rating: 4.9
      }
    },
    {
      _id: '3',
      employeeId: 'EMP-1003',
      personalInfo: {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@company.com',
        phone: '+1-555-0125',
        address: {
          street: '789 Pine St',
          city: 'Boston',
          state: 'MA',
          zipCode: '02108'
        }
      },
      license: {
        number: 'D456789123',
        class: 'CDL-A',
        expirationDate: '2025-03-20'
      },
      employment: {
        hireDate: '2021-11-10',
        status: 'active',
        payRate: 30.00
      },
      currentStatus: 'off-duty',
      assignedVehicle: null,
      performance: {
        totalDeliveries: 420,
        onTimeDeliveries: 410,
        rating: 4.7
      }
    }
  ];

  useEffect(() => {
    setDrivers(mockDrivers);
    setLoading(false);
  }, []);

  const filteredDrivers = drivers.filter(driver => {
    const fullName = `${driver.personalInfo.firstName} ${driver.personalInfo.lastName}`;
    const matchesSearch = 
      driver.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || driver.currentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: {
        className: 'bg-green-100 text-green-800',
        label: 'Available'
      },
      'on-duty': {
        className: 'bg-blue-100 text-blue-800',
        label: 'On Duty'
      },
      'off-duty': {
        className: 'bg-gray-100 text-gray-800',
        label: 'Off Duty'
      },
      break: {
        className: 'bg-yellow-100 text-yellow-800',
        label: 'On Break'
      }
    };

    const config = statusConfig[status];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const handleDelete = async (driverId) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        setDrivers(drivers.filter(d => d._id !== driverId));
        toast({
          title: "Success",
          description: "Driver deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete driver",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>
        <Button onClick={() => navigate('/drivers/new')}>
          <Plus size={16} className="mr-2" />
          Add Driver
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search drivers..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sm:w-64">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <Filter size={18} className="mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Drivers</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="on-duty">On Duty</SelectItem>
              <SelectItem value="off-duty">Off Duty</SelectItem>
              <SelectItem value="break">On Break</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Drivers grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <Card key={driver._id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {driver.personalInfo.firstName} {driver.personalInfo.lastName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{driver.employeeId}</p>
                  </div>
                </div>
                {getStatusBadge(driver.currentStatus)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail size={14} className="mr-2" />
                  {driver.personalInfo.email}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone size={14} className="mr-2" />
                  {driver.personalInfo.phone}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin size={14} className="mr-2" />
                  {driver.personalInfo.address.city}, {driver.personalInfo.address.state}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">License Class</p>
                  <p className="font-medium">{driver.license.class}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pay Rate</p>
                  <p className="font-medium">${driver.employment.payRate}/hr</p>
                </div>
              </div>

              {driver.assignedVehicle && (
                <div className="pt-2 border-t">
                  <div className="flex items-center text-sm">
                    <Car size={14} className="mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Assigned Vehicle:</span>
                    <span className="ml-1 font-medium">
                      {driver.assignedVehicle.vehicleId}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Performance</span>
                  <div className="flex items-center">
                    <Award size={14} className="mr-1 text-yellow-500" />
                    <span className="font-medium">{driver.performance.rating}/5.0</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {driver.performance.totalDeliveries} deliveries, {Math.round((driver.performance.onTimeDeliveries / driver.performance.totalDeliveries) * 100)}% on-time
                </p>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => navigate(`/drivers/${driver._id}`)}
                >
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/drivers/${driver._id}/edit`)}
                >
                  <Edit size={14} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(driver._id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <Card>
          <CardContent className="text-center py-10">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-muted-foreground">No drivers found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const DriverForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      dateOfBirth: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      }
    },
    license: {
      number: '',
      class: 'CDL-A',
      expirationDate: '',
      endorsements: []
    },
    employment: {
      hireDate: '',
      payRate: ''
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call would go here
      toast({
        title: "Success",
        description: `Driver ${isEdit ? 'updated' : 'created'} successfully`,
      });
      navigate('/drivers');
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? 'update' : 'create'} driver`,
        variant: "destructive",
      });
    }
  };

  const handleChange = (field, value) => {
    const fields = field.split('.');
    if (fields.length === 1) {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else if (fields.length === 2) {
      setFormData(prev => ({
        ...prev,
        [fields[0]]: {
          ...prev[fields[0]],
          [fields[1]]: value
        }
      }));
    } else if (fields.length === 3) {
      setFormData(prev => ({
        ...prev,
        [fields[0]]: {
          ...prev[fields[0]],
          [fields[1]]: {
            ...prev[fields[0]][fields[1]],
            [fields[2]]: value
          }
        }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/drivers')}>
          ← Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Driver' : 'Add New Driver'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Driver Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.personalInfo.firstName}
                    onChange={(e) => handleChange('personalInfo.firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.personalInfo.lastName}
                    onChange={(e) => handleChange('personalInfo.lastName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => handleChange('personalInfo.email', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handleChange('personalInfo.phone', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.personalInfo.dateOfBirth}
                    onChange={(e) => handleChange('personalInfo.dateOfBirth', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={formData.personalInfo.address.street}
                    onChange={(e) => handleChange('personalInfo.address.street', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.personalInfo.address.city}
                    onChange={(e) => handleChange('personalInfo.address.city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.personalInfo.address.state}
                    onChange={(e) => handleChange('personalInfo.address.state', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.personalInfo.address.zipCode}
                    onChange={(e) => handleChange('personalInfo.address.zipCode', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* License Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">License Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number *</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.license.number}
                    onChange={(e) => handleChange('license.number', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseClass">License Class *</Label>
                  <Select 
                    value={formData.license.class} 
                    onValueChange={(value) => handleChange('license.class', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CDL-A">CDL-A</SelectItem>
                      <SelectItem value="CDL-B">CDL-B</SelectItem>
                      <SelectItem value="CDL-C">CDL-C</SelectItem>
                      <SelectItem value="Regular">Regular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseExpiration">License Expiration *</Label>
                  <Input
                    id="licenseExpiration"
                    type="date"
                    value={formData.license.expirationDate}
                    onChange={(e) => handleChange('license.expirationDate', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Employment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hireDate">Hire Date *</Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={formData.employment.hireDate}
                    onChange={(e) => handleChange('employment.hireDate', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payRate">Pay Rate ($/hour)</Label>
                  <Input
                    id="payRate"
                    type="number"
                    step="0.01"
                    value={formData.employment.payRate}
                    onChange={(e) => handleChange('employment.payRate', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Contact Name</Label>
                  <Input
                    id="emergencyName"
                    value={formData.personalInfo.emergencyContact.name}
                    onChange={(e) => handleChange('personalInfo.emergencyContact.name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.personalInfo.emergencyContact.phone}
                    onChange={(e) => handleChange('personalInfo.emergencyContact.phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={formData.personalInfo.emergencyContact.relationship}
                    onChange={(e) => handleChange('personalInfo.emergencyContact.relationship', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit">
                {isEdit ? 'Update Driver' : 'Create Driver'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/drivers')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const Drivers = () => {
  return (
    <Routes>
      <Route path="/" element={<DriversList />} />
      <Route path="/new" element={<DriverForm />} />
      <Route path="/:id/edit" element={<DriverForm isEdit={true} />} />
    </Routes>
  );
};

export default Drivers;