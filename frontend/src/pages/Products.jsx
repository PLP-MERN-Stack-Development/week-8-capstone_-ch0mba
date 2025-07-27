import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Filter, Package, AlertTriangle, 
  Edit, Trash2, Barcode, TrendingDown, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

const ProductsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  // Mock data for demonstration
  const mockProducts = [
    {
      _id: '1',
      productId: 'P-1001',
      name: 'Office Supplies Bundle',
      description: 'Complete office supplies package including pens, paper, folders',
      category: 'Office Equipment',
      price: 45.99,
      weight: 5.2,
      dimensions: {
        length: 12,
        width: 10,
        height: 8
      },
      inventory: {
        quantity: 150,
        location: 'Warehouse A - Section 1',
        reorderLevel: 25
      },
      supplier: {
        name: 'Office Depot',
        contact: 'John Smith',
        phone: '+1-555-0150',
        email: 'orders@officedepot.com'
      },
      barcode: '123456789012',
      sku: 'OS-001',
      isActive: true
    },
    {
      _id: '2',
      productId: 'P-1002',
      name: 'Industrial Safety Equipment',
      description: 'Safety helmets, gloves, and protective gear',
      category: 'Safety Equipment',
      price: 89.50,
      weight: 8.5,
      dimensions: {
        length: 18,
        width: 14,
        height: 12
      },
      inventory: {
        quantity: 15,
        location: 'Warehouse B - Section 3',
        reorderLevel: 20
      },
      supplier: {
        name: 'Safety First Inc',
        contact: 'Jane Doe',
        phone: '+1-555-0151',
        email: 'orders@safetyfirst.com'
      },
      barcode: '234567890123',
      sku: 'SE-002',
      isActive: true
    },
    {
      _id: '3',
      productId: 'P-1003',
      name: 'Electronics Package',
      description: 'Computers, monitors, and accessories',
      category: 'Electronics',
      price: 1250.00,
      weight: 25.0,
      dimensions: {
        length: 24,
        width: 18,
        height: 16
      },
      inventory: {
        quantity: 8,
        location: 'Warehouse A - Section 5',
        reorderLevel: 5
      },
      supplier: {
        name: 'Tech Solutions',
        contact: 'Mike Johnson',
        phone: '+1-555-0152',
        email: 'orders@techsolutions.com'
      },
      barcode: '345678901234',
      sku: 'EL-003',
      isActive: true
    },
    {
      _id: '4',
      productId: 'P-1004',
      name: 'Furniture Set',
      description: 'Desk, chair, and filing cabinet',
      category: 'Furniture',
      price: 650.75,
      weight: 85.0,
      dimensions: {
        length: 60,
        width: 30,
        height: 36
      },
      inventory: {
        quantity: 45,
        location: 'Warehouse C - Section 2',
        reorderLevel: 10
      },
      supplier: {
        name: 'Office Furniture Co',
        contact: 'Sarah Wilson',
        phone: '+1-555-0153',
        email: 'orders@officefurniture.com'
      },
      barcode: '456789012345',
      sku: 'FU-004',
      isActive: true
    }
  ];

  useEffect(() => {
    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = product.inventory.quantity <= product.inventory.reorderLevel;
    } else if (stockFilter === 'out') {
      matchesStock = product.inventory.quantity === 0;
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const getStockStatus = (product) => {
    const { quantity, reorderLevel } = product.inventory;
    
    if (quantity === 0) {
      return {
        status: 'out',
        className: 'bg-red-100 text-red-800',
        label: 'Out of Stock',
        icon: AlertTriangle
      };
    } else if (quantity <= reorderLevel) {
      return {
        status: 'low',
        className: 'bg-yellow-100 text-yellow-800',
        label: 'Low Stock',
        icon: TrendingDown
      };
    } else {
      return {
        status: 'good',
        className: 'bg-green-100 text-green-800',
        label: 'In Stock',
        icon: TrendingUp
      };
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setProducts(products.filter(p => p._id !== productId));
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
    }
  };

  const categories = [...new Set(products.map(p => p.category))];
  const totalValue = filteredProducts.reduce((sum, product) => sum + (product.price * product.inventory.quantity), 0);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} products • Total value: ${totalValue.toLocaleString()}
          </p>
        </div>
        <Button onClick={() => navigate('/products/new')}>
          <Plus size={16} className="mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sm:w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <Filter size={18} className="mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:w-48">
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock Levels</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product);
          const StockIcon = stockStatus.icon;
          
          return (
            <Card key={product._id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{product.productId}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.className}`}>
                    <StockIcon size={12} className="mr-1" />
                    {stockStatus.label}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Price</p>
                    <p className="font-semibold text-lg">${product.price}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stock</p>
                    <p className="font-medium">
                      {product.inventory.quantity} units
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Weight</p>
                    <p className="font-medium">{product.weight} lbs</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">{product.inventory.location}</p>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">SKU: {product.sku}</span>
                    <div className="flex items-center">
                      <Barcode size={14} className="mr-1 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{product.barcode}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/products/${product._id}/edit`)}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-10">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-muted-foreground">No products found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const ProductForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    inventory: {
      quantity: '',
      location: '',
      reorderLevel: ''
    },
    supplier: {
      name: '',
      contact: '',
      phone: '',
      email: ''
    },
    barcode: '',
    sku: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call would go here
      toast({
        title: "Success",
        description: `Product ${isEdit ? 'updated' : 'created'} successfully`,
      });
      navigate('/products');
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? 'update' : 'create'} product`,
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
        <Button variant="outline" onClick={() => navigate('/products')}>
          ← Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => handleChange('barcode', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dimensions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="length">Length (inches)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    value={formData.dimensions.length}
                    onChange={(e) => handleChange('dimensions.length', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Width (inches)</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    value={formData.dimensions.width}
                    onChange={(e) => handleChange('dimensions.width', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (inches)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={formData.dimensions.height}
                    onChange={(e) => handleChange('dimensions.height', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.inventory.quantity}
                    onChange={(e) => handleChange('inventory.quantity', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reorderLevel">Reorder Level</Label>
                  <Input
                    id="reorderLevel"
                    type="number"
                    value={formData.inventory.reorderLevel}
                    onChange={(e) => handleChange('inventory.reorderLevel', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.inventory.location}
                    onChange={(e) => handleChange('inventory.location', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Supplier Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="supplierName">Supplier Name</Label>
                  <Input
                    id="supplierName"
                    value={formData.supplier.name}
                    onChange={(e) => handleChange('supplier.name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplierContact">Contact Person</Label>
                  <Input
                    id="supplierContact"
                    value={formData.supplier.contact}
                    onChange={(e) => handleChange('supplier.contact', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplierPhone">Phone</Label>
                  <Input
                    id="supplierPhone"
                    value={formData.supplier.phone}
                    onChange={(e) => handleChange('supplier.phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplierEmail">Email</Label>
                  <Input
                    id="supplierEmail"
                    type="email"
                    value={formData.supplier.email}
                    onChange={(e) => handleChange('supplier.email', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit">
                {isEdit ? 'Update Product' : 'Create Product'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/products')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const Products = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductsList />} />
      <Route path="/new" element={<ProductForm />} />
      <Route path="/:id/edit" element={<ProductForm isEdit={true} />} />
    </Routes>
  );
};

export default Products;