import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Filter, Car, Wrench, AlertTriangle, 
  ChevronRight, Calendar, Fuel, Settings, Edit, Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

const VehiclesList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for demonstration
  const mockVehicles = [
    {
      _id: '1',
      vehicleId: 'V-1001',
      make: 'Ford',
      model: 'Transit',
      year: 2022,
      licensePlate: 'ABC-123',
      type: 'van',
      status: 'available',
      currentMileage: 15000,
      fuelType: 'gasoline',
      fuelEfficiency: 18.5,
      assignedDriver: {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe'
        }
      },
      capacity: {
        weight: 3500,
        volume: 400
      }
    },
    {
      _id: '2',
      vehicleId: 'V-1002',
      make: 'Mercedes',
      model: 'Sprinter',
      year: 2021,
      licensePlate: 'XYZ-789',
      type: 'van',
      status: 'in-use',
      currentMileage: 22000,
      fuelType: 'diesel',
      fuelEfficiency: 22.0,
      assignedDriver: {
        personalInfo: {
          firstName: 'Jane',
          lastName: 'Smith'
        }
      },
      capacity: {
        weight: 5000,
        volume: 600
      }
    },
    {
      _id: '3',
      vehicleId: 'V-1003',
      make: 'Isuzu',
      model: 'NPR',
      year: 2020,
      licensePlate: 'DEF-456',
      type: 'truck',
      status: 'maintenance',
      currentMileage: 45000,
      fuelType: 'diesel',
      fuelEfficiency: 12.0,
      assignedDriver: null,
      capacity: {
        weight: 12000,
        volume: 1200
      }
    }
  ];

  useEffect(() => {
    setVehicles(mockVehicles);
    setLoading(false);
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: {
        icon: Car,
        className: 'bg-green-100 text-green-800',
        label: 'Available'
      },
      'in-use': {
        icon: Car,
        className: 'bg-blue-100 text-blue-800',
        label: 'In Use'
      },
      maintenance: {
        icon: Wrench,
        className: 'bg-yellow-100 text-yellow-800',
        label: 'Maintenance'
      },
      'out-of-service': {
        icon: AlertTriangle,
        className: 'bg-red-100 text-red-800',
        label: 'Out of Service'
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        <Icon size={12} className="mr-1" />
        {config.label}
      </span>
    );
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        setVehicles(vehicles.filter(v => v._id !== vehicleId));
        toast({
          title: "Success",
          description: "Vehicle deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete vehicle",
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
        <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
        <Button onClick={() => navigate('/vehicles/new')}>
          <Plus size={16} className="mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search vehicles..."
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
              <SelectItem value="all">All Vehicles</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in-use">In Use</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="out-of-service">Out of Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Vehicles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle._id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{vehicle.vehicleId}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </p>
                </div>
                {getStatusBadge(vehicle.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">License Plate</p>
                  <p className="font-medium">{vehicle.licensePlate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{vehicle.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Mileage</p>
                  <p className="font-medium">{vehicle.currentMileage.toLocaleString()} mi</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fuel Type</p>
                  <p className="font-medium capitalize">{vehicle.fuelType}</p>
                </div>
              </div>

              {vehicle.assignedDriver && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Assigned Driver</p>
                  <p className="font-medium">
                    {vehicle.assignedDriver.personalInfo.firstName} {vehicle.assignedDriver.personalInfo.lastName}
                  </p>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => navigate(`/vehicles/${vehicle._id}`)}
                >
                  <Settings size={14} className="mr-1" />
                  Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/vehicles/${vehicle._id}/edit`)}
                >
                  <Edit size={14} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(vehicle._id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="text-center py-10">
            <Car size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-muted-foreground">No vehicles found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const VehicleForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    vin: '',
    type: 'van',
    fuelType: 'gasoline',
    fuelEfficiency: '',
    capacity: {
      weight: '',
      volume: ''
    },
    insurance: {
      provider: '',
      policyNumber: '',
      expirationDate: ''
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call would go here
      toast({
        title: "Success",
        description: `Vehicle ${isEdit ? 'updated' : 'created'} successfully`,
      });
      navigate('/vehicles');
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? 'update' : 'create'} vehicle`,
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
        <Button variant="outline" onClick={() => navigate('/vehicles')}>
          ← Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  value={formData.make}
                  onChange={(e) => handleChange('make', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => handleChange('year', parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate *</Label>
                <Input
                  id="licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => handleChange('licensePlate', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vin">VIN *</Label>
                <Input
                  id="vin"
                  value={formData.vin}
                  onChange={(e) => handleChange('vin', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Vehicle Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type *</Label>
                <Select value={formData.fuelType} onValueChange={(value) => handleChange('fuelType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gasoline">Gasoline</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuelEfficiency">Fuel Efficiency (MPG)</Label>
                <Input
                  id="fuelEfficiency"
                  type="number"
                  step="0.1"
                  value={formData.fuelEfficiency}
                  onChange={(e) => handleChange('fuelEfficiency', parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Capacity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight Capacity (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.capacity.weight}
                    onChange={(e) => handleChange('capacity.weight', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volume">Volume Capacity (cu ft)</Label>
                  <Input
                    id="volume"
                    type="number"
                    value={formData.capacity.volume}
                    onChange={(e) => handleChange('capacity.volume', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Insurance Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="provider">Insurance Provider</Label>
                  <Input
                    id="provider"
                    value={formData.insurance.provider}
                    onChange={(e) => handleChange('insurance.provider', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="policyNumber">Policy Number</Label>
                  <Input
                    id="policyNumber"
                    value={formData.insurance.policyNumber}
                    onChange={(e) => handleChange('insurance.policyNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    value={formData.insurance.expirationDate}
                    onChange={(e) => handleChange('insurance.expirationDate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit">
                {isEdit ? 'Update Vehicle' : 'Create Vehicle'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/vehicles')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const Vehicles = () => {
  return (
    <Routes>
      <Route path="/" element={<VehiclesList />} />
      <Route path="/new" element={<VehicleForm />} />
      <Route path="/:id/edit" element={<VehicleForm isEdit={true} />} />
    </Routes>
  );
};

export default Vehicles;