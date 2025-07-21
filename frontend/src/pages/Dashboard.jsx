import { 
  Truck, Car, Users, DollarSign, TrendingUp, AlertCircle, 
  Calendar, ArrowUp, ArrowDown, MoreVertical 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`p-2 rounded-full ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-semibold">{value}</p>
          {trend !== undefined && (
            <div className={`flex items-center text-sm ${
              trend >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              <span className="ml-1">{Math.abs(trend)}% {trend >= 0 ? 'increase' : 'decrease'}</span>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const QuickAction = ({ title, icon: Icon, color, link }) => (
  <Link to={link}>
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <CardContent className="flex items-center p-4">
        <div className={`p-2 rounded-full mr-3 ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        <span className="text-sm font-medium">{title}</span>
      </CardContent>
    </Card>
  </Link>
);

const Dashboard = () => {
  const alerts = [
    { id: 1, message: 'Vehicle #T-238 requires maintenance', type: 'warning' },
    { id: 2, message: 'Driver John Doe has exceeded working hours', type: 'error' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Today, {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-700">Alerts ({alerts.length})</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {alerts.map(alert => (
                      <li key={alert.id}>{alert.message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Deliveries" 
          value="24" 
          icon={Truck}
          trend={8}
          color="bg-blue-600"
        />
        <StatCard 
          title="Available Vehicles" 
          value="12/15" 
          icon={Car}
          color="bg-green-600"
        />
        <StatCard 
          title="Active Drivers" 
          value="8/10" 
          icon={Users}
          color="bg-orange-600"
        />
        <StatCard 
          title="Monthly Expenses" 
          value="$14,250" 
          icon={DollarSign}
          trend={-3.2}
          color="bg-slate-800"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <QuickAction 
            title="New Delivery" 
            icon={Truck}
            color="bg-blue-600"
            link="/deliveries/new"
          />
          <QuickAction 
            title="Add Vehicle" 
            icon={Car}
            color="bg-green-600"
            link="/vehicles/new"
          />
          <QuickAction 
            title="Add Driver" 
            icon={Users}
            color="bg-orange-600"
            link="/drivers/new"
          />
          <QuickAction 
            title="Log Expense" 
            icon={DollarSign}
            color="bg-slate-800"
            link="/expenses/new"
          />
          <QuickAction 
            title="Run Report" 
            icon={TrendingUp}
            color="bg-blue-600"
            link="/reports"
          />
          <QuickAction 
            title="Schedule" 
            icon={Calendar}
            color="bg-green-600"
            link="/deliveries/schedule"
          />
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Delivery Overview</CardTitle>
              <Button variant="ghost" size="icon">
                <MoreVertical size={18} />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Map and charts will be displayed here
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
              <Button variant="ghost" size="icon">
                <MoreVertical size={18} />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 flex-shrink-0">
                    <Truck size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Delivery Completed</p>
                    <p className="text-sm text-muted-foreground">Delivery #D-1234</p>
                    <p className="text-xs text-muted-foreground">30m ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                    <Users size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Driver Started Shift</p>
                    <p className="text-sm text-muted-foreground">John Doe</p>
                    <p className="text-xs text-muted-foreground">2h ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 flex-shrink-0">
                    <Car size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Maintenance Due</p>
                    <p className="text-sm text-muted-foreground">Truck #T-238</p>
                    <p className="text-xs text-muted-foreground">3h ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;