import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertTriangle, Search, TrendingUp, Edit, Eye, AlertCircle } from 'lucide-react';

export function InventoryManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products and sales data
  const fetchProductsData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      // Fetch products
      const productsResponse = await fetch(`${apiUrl}/api/products`);
      const productsResult = await productsResponse.json();

      // Fetch orders to calculate sales data
      const ordersResponse = await fetch(`${apiUrl}/api/orders`);
      const ordersResult = await ordersResponse.json();

      if (productsResult.success) {
        const productsData = productsResult.data;
        const ordersData = ordersResult.success ? ordersResult.data : [];

        // Calculate sales data for each product
        const productsWithSalesData = productsData.map((product) => {
          // Calculate total stock from sizes array
          const totalStock = Array.isArray(product.sizes) && product.sizes.length > 0
            ? product.sizes.reduce((total, sizeStock) => total + (sizeStock.stock || 0), 0)
            : product.stock;

          // Calculate units sold from orders
          const unitsSold = ordersData.reduce((total, order) => {
            const productItems = order.items?.filter((item) => item.productId === product.id) || [];
            return total + productItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
          }, 0);

          // Determine if fast selling (sold more than 20 units)
          const fastSelling = unitsSold > 20;

          // Determine if low stock (less than 15 total stock)
          const lowStock = totalStock < 15;

          return {
            ...product,
            totalStock,
            unitsSold,
            fastSelling,
            lowStock
          };
        });

        setProducts(productsWithSalesData);
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch products data' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Network error while fetching data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  const calculateTotalStock = (product) => {
    return product.totalStock || 0;
  };

  const calculateTotalSold = (product) => {
    return product.unitsSold || 0;
  };

  const calculateGrossMargin = (product) => {
    const costPrice = product.price.cost || 0;
    const sellingPrice = product.price.current;
    if (sellingPrice === 0) return '0.0';
    return (((sellingPrice - costPrice) / sellingPrice) * 100).toFixed(1);
  };

  const calculateNetProfit = (product) => {
    const costPrice = product.price.cost || 0;
    const sellingPrice = product.price.current;
    return (sellingPrice - costPrice).toFixed(2);
  };

  const getStockStatus = (product) => {
    const totalStock = calculateTotalStock(product);
    if (totalStock <= 5) return 'critical';
    if (totalStock < 15) return 'low';
    return 'good';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.categoryName === selectedCategory;
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'low-stock' && product.lowStock) ||
      (filterStatus === 'fast-selling' && product.fastSelling);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(products.map(p => p.categoryName))];
  const totalValue = products.reduce((sum, product) => {
    const costPrice = product.price.cost || 0;
    return sum + (calculateTotalStock(product) * costPrice);
  }, 0);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p>Loading inventory data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message.text && (
        <Alert className={`${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Active SKUs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">At cost price</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {products.filter(p => p.lowStock).length}
            </div>
            <p className="text-xs text-muted-foreground">Require restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fast Moving Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.fastSelling).length}
            </div>
            <p className="text-xs text-muted-foreground">High demand products</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Management */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Product Inventory</CardTitle>
            <CardDescription>Manage stock levels, costs, and pricing</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="fast-selling">Fast Selling</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Units Sold</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Profit Margin</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const totalStock = calculateTotalStock(product);
                const totalSold = calculateTotalSold(product);
                const stockStatus = getStockStatus(product);

                return (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.sku} • {product.categoryName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{totalStock} units</span>
                          <span className={`
                            ${stockStatus === 'critical' ? 'text-red-600' :
                              stockStatus === 'low' ? 'text-orange-600' : 'text-green-600'}
                          `}>
                            {stockStatus}
                          </span>
                        </div>
                        <Progress
                          value={Math.min((totalStock / 50) * 100, 100)}
                          className="h-1"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {totalSold}
                        {product.fastSelling && (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>Cost: ৳{product.price.cost || 0}</div>
                        <div>Price: ৳{product.price.current}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>Gross: {calculateGrossMargin(product)}%</div>
                        <div>Net: ৳{calculateNetProfit(product)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {product.lowStock && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Low Stock
                          </Badge>
                        )}
                        {product.fastSelling && (
                          <Badge variant="default" className="text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Fast Selling
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>{product.name} - Inventory Details</DialogTitle>
                              <DialogDescription>
                                Detailed view of product inventory and performance
                              </DialogDescription>
                            </DialogHeader>
                            {selectedProduct && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-medium mb-3">Product Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>SKU:</span>
                                        <span className="font-medium">{selectedProduct.sku}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Category:</span>
                                        <span className="font-medium">{selectedProduct.categoryName}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Making Cost:</span>
                                        <span className="font-medium">৳{selectedProduct.price.cost || 0}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Selling Price:</span>
                                        <span className="font-medium">৳{selectedProduct.price.current}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Original Price:</span>
                                        <span className="font-medium">৳{selectedProduct.price.original}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-3">Financial Analysis</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Gross Margin:</span>
                                        <span className="font-medium text-green-600">
                                          {calculateGrossMargin(selectedProduct)}%
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Net Profit per Unit:</span>
                                        <span className="font-medium text-green-600">
                                          ৳{calculateNetProfit(selectedProduct)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Total Units Sold:</span>
                                        <span className="font-medium">{calculateTotalSold(selectedProduct)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Total Revenue:</span>
                                        <span className="font-medium">
                                          ৳{(calculateTotalSold(selectedProduct) * selectedProduct.price.current).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-3">Size-wise Inventory</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Size</TableHead>
                                        <TableHead>In Stock</TableHead>
                                        <TableHead>Sold</TableHead>
                                        <TableHead>Returned</TableHead>
                                        <TableHead>Stock Status</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedProduct.sizes && selectedProduct.sizes.length > 0 ? (
                                        selectedProduct.sizes.map((sizeData, index) => (
                                          <TableRow key={index}>
                                            <TableCell className="font-medium">{sizeData.size}</TableCell>
                                            <TableCell>{sizeData.stock}</TableCell>
                                            <TableCell>-</TableCell>
                                            <TableCell>-</TableCell>
                                            <TableCell>
                                              <Badge variant={
                                                sizeData.stock <= 5 ? 'destructive' :
                                                  sizeData.stock <= 15 ? 'secondary' : 'default'
                                              }>
                                                {sizeData.stock <= 5 ? 'Critical' :
                                                  sizeData.stock <= 15 ? 'Low' : 'Good'}
                                              </Badge>
                                            </TableCell>
                                          </TableRow>
                                        ))
                                      ) : (
                                        <TableRow>
                                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            No size-specific inventory available
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Update Product Status</DialogTitle>
                              <DialogDescription>
                                Update the status flags for {product.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`featured-${product._id}`}
                                  defaultChecked={product.isFeatured}
                                  className="rounded"
                                />
                                <label htmlFor={`featured-${product._id}`} className="text-sm font-medium">
                                  Featured Product
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`new-arrival-${product._id}`}
                                  defaultChecked={product.isNewArrival}
                                  className="rounded"
                                />
                                <label htmlFor={`new-arrival-${product._id}`} className="text-sm font-medium">
                                  New Arrival
                                </label>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                              <Button variant="outline" onClick={() => { }}>
                                Cancel
                              </Button>
                              <Button onClick={() => {
                                // In a real implementation, this would call an API to update the product
                                console.log('Update product status:', product._id);
                              }}>
                                Update
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default InventoryManagement;
