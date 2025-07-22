import { Routes, Route } from 'react-router-dom';
import { Toaster } from "./components/ui/sonner";
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Deliveries from '@/pages/Deliveries';
import Vehicles from '@/pages/Vehicles';
import Drivers from '@/pages/Drivers';
import Expenses from '@/pages/Expenses';
import Products from '@/pages/Products';
import Reports from '@/pages/Reports';
import { AuthProvider } from '@/context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/deliveries/*" element={<Deliveries />} />
          <Route path="/vehicles/*" element={<Vehicles />} />
          <Route path="/drivers/*" element={<Drivers />} />
          <Route path="/expenses/*" element={<Expenses />} />
          <Route path="/products/*" element={<Products />} />
          <Route path="/reports/*" element={<Reports />} />
        </Routes>
      </Layout>
      <Toaster />
    </AuthProvider>
  );
}

export default App;