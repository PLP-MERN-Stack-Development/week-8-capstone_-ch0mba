import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Truck, Users, Car, DollarSign, PackageOpen, 
  BarChart2, Menu, X, Bell, Home, LogOut, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Deliveries', path: '/deliveries', icon: Truck },
    { name: 'Vehicles', path: '/vehicles', icon: Car },
    { name: 'Drivers', path: '/drivers', icon: Users },
    { name: 'Expenses', path: '/expenses', icon: DollarSign },
    { name: 'Products', path: '/products', icon: PackageOpen },
    { name: 'Reports', path: '/reports', icon: BarChart2 },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Truck size={24} className="text-blue-500" />
              <span className="text-xl font-semibold">LogiTrack</span>
            </div>
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-300 hover:bg-slate-800"
            >
              <X size={20} />
            </Button>
          </div>
          
          <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full justify-start text-left ${
                    isActive(item.path)
                      ? 'bg-slate-800 text-white'
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </Button>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-slate-800">
            {user && (
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center mr-3">
                  <User size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-300 truncate">{user.role}</p>
                </div>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="ml-2 text-gray-300 hover:bg-slate-800"
                  title="Logout"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-blue-600 hover:bg-gray-100"
            >
              <Menu size={24} />
            </Button>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;