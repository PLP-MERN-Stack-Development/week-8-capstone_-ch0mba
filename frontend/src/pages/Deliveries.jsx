import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Filter, MapPin, ChevronRight, 
  Truck, Clock, CheckCircle, XCircle, Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DeliveriesList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Mock delivery data
  const deliveries = [
    {
      id: 'D-1001',
      customer: 'ABC Corporation',
      address: '123 Business Ave, New York, NY 10001',
      date: '2025-01-15',
      status: 'completed',
      driver: 'John Doe',
      vehicle: 'T-238',
      products: [
        { id: 'P001', name: 'Office Supplies', quantity: 10 },
        { id: 'P002', name: 'Furniture', quantity: 5 },
      ],
    },
    {
      id: 'D-1002',
      customer: 'XYZ Industries',
      address: '456 Factory Rd, Chicago, IL 60007',
      date: '2025-01-16',
      status: 'in-progress',
      driver: 'Jane Smith',
      vehicle: 'T-102',
      products: [
        { id: 'P003', name: 'Industrial Parts', quantity: 50 },
      ],
    },
    {
      id: 'D-1003',
      customer: 'Acme Corp',
      address: '789 Main St, Boston, MA 02108',
      date: '2025-01-20',
      status: 'scheduled',
      driver: 'Mike Johnson',
      vehicle: 'T-305',
      products: [
        { id: 'P001', name: 'Office Supplies', quantity: 20 },
        { id: 'P004', name: 'Electronics', quantity: 15 },
      ],
    },
  ];

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      delivery.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        icon: CheckCircle,
        className: 'bg-green-100 text-green-800',
        label: 'Completed'
      },
      'in-progress': {
        icon: Truck,
        className: 'bg-blue-100 text-blue-800',
        label: 'In Progress'
      },
      scheduled: {
        icon: Calendar,
        className: 'bg-gray-100 text-gray-800',
        label: 'Scheduled'
      },
      cancelled: {
        icon: XCircle,
        className: 'bg-red-100 text-red-800',
        label: 'Cancelled'
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Deliveries</h1>
        <Button onClick={() => navigate('/deliveries/new')}>
          <Plus size={16} className="mr-2" />
          New Delivery
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search deliveries..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sm:w-64">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <Filter size={18} className="mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Deliveries</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Deliveries list */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {filteredDeliveries.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-muted-foreground">No deliveries found matching your criteria.</p>
              </div>
            ) : (
              filteredDeliveries.map((delivery) => (
                <div 
                  key={delivery.id}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onClick={() => navigate(`/deliveries/${delivery.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-blue-600">{delivery.id}</p>
                        <span className="mx-2 text-gray-300">•</span>
                        <p className="text-sm font-medium text-gray-900">{delivery.customer}</p>
                        <div className="ml-4">
                          {getStatusBadge(delivery.status)}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <MapPin size={16} className="flex-shrink-0 mr-1.5" />
                        <p className="truncate">{delivery.address}</p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <Clock size={16} className="flex-shrink-0 mr-1.5" />
                        <p>{new Date(delivery.date).toLocaleDateString()}</p>
                        <span className="mx-2 text-gray-300">•</span>
                        <p>{delivery.driver}</p>
                        <span className="mx-2 text-gray-300">•</span>
                        <p>Vehicle: {delivery.vehicle}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Deliveries = () => {
  return (
    <Routes>
      <Route path="/" element={<DeliveriesList />} />
      <Route path="/new" element={<div>New Delivery Form</div>} />
      <Route path="/:id" element={<div>Delivery Detail</div>} />
    </Routes>
  );
};

export default Deliveries;