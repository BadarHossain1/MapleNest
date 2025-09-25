import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Edit, Eye, Mail, Phone, MapPin, Loader } from 'lucide-react';

// Customer Profile View Component
function CustomerProfileView({ customer }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Contact Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {customer.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {customer.phone || 'Not provided'}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {customer.location || 'Not provided'}
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Account Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Member Since:</span>
              <span>{customer.dateOfJoining}</span>
            </div>
            <div className="flex justify-between">
              <span>Email Verified:</span>
              <span>{customer.isEmailVerified ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span>{customer.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Purchase History</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Orders:</span>
              <span className="font-medium">{customer.totalOrders || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Spent:</span>
              <span className="font-medium">৳{(customer.totalSpent || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Order Value:</span>
              <span className="font-medium">
                ৳{customer.totalOrders && customer.totalSpent ?
                  Math.round(customer.totalSpent / customer.totalOrders).toLocaleString() : '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Last Order:</span>
              <span className="font-medium">
                {customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : 'No orders'}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Customer Segment</h4>
          <Badge variant={customer.segment === 'vip' ? 'default' : 'secondary'}>
            {customer.segment.charAt(0).toUpperCase() + customer.segment.slice(1).replace('-', ' ')}
          </Badge>
        </div>
      </div>
    </div>
  );
}

// Edit Customer Form Component
function EditCustomerForm({ customer, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    fullName: customer.fullName,
    email: customer.email,
    phone: customer.phone || '',
    location: customer.location || '',
    country: customer.country || '',
    segment: customer.segment,
    isActive: customer.isActive,
    isEmailVerified: customer.isEmailVerified
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/users/${customer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Customer updated successfully!');
        onUpdate();
        onClose();
      } else {
        throw new Error(result.message || 'Failed to update customer');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Failed to update customer. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="City, State"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            placeholder="Country"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="segment">Customer Segment</Label>
          <Select value={formData.segment} onValueChange={(value) => setFormData({ ...formData, segment: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new-buyer">New Buyer</SelectItem>
              <SelectItem value="loyal">Loyal Customer</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="seasonal-shopper">Seasonal Shopper</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 col-span-2">
          <Label>Account Status</Label>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <span className="text-sm">Active</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isEmailVerified}
                onChange={(e) => setFormData({ ...formData, isEmailVerified: e.target.checked })}
              />
              <span className="text-sm">Email Verified</span>
            </label>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={updateLoading}>
          {updateLoading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
          Update Customer
        </Button>
      </DialogFooter>
    </form>
  );
}

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customerStats, setCustomerStats] = useState({
    totalCustomers: 0,
    vipCustomers: 0,
    avgCustomerValue: 0,
    retentionRate: 0
  });

  useEffect(() => {
    fetchCustomersData();
  }, []);

  const fetchCustomersData = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const [usersRes, ordersRes] = await Promise.all([
        fetch(`${apiUrl}/api/users`),
        fetch(`${apiUrl}/api/orders`)
      ]);

      if (!usersRes.ok) {
        throw new Error(`Users API error: ${usersRes.status} ${usersRes.statusText}`);
      }
      if (!ordersRes.ok) {
        throw new Error(`Orders API error: ${ordersRes.status} ${ordersRes.statusText}`);
      }

      const [usersData, ordersData] = await Promise.all([
        usersRes.json(),
        ordersRes.json()
      ]);

      const users = usersData.success ? usersData.data : [];
      const orders = ordersData.success ? ordersData.data : [];

      const enrichedCustomers = users.map((user) => {
        const userOrders = orders.filter((order) => order.userEmail === user.email);
        const totalSpent = userOrders.reduce((sum, order) => {
          // Handle different possible order total field names
          const orderTotal = order.orderSummary?.total || order.totalAmount || order.total || 0;
          return sum + orderTotal;
        }, 0);
        const lastOrderDate = userOrders.length > 0
          ? userOrders.sort((a, b) => new Date(b.orderDate || b.createdAt).getTime() - new Date(a.orderDate || a.createdAt).getTime())[0]
          : null;

        return {
          ...user,
          totalOrders: userOrders.length,
          totalSpent: Math.round(totalSpent * 100) / 100, // Round to 2 decimal places
          lastOrder: lastOrderDate ? (lastOrderDate.orderDate || lastOrderDate.createdAt) : undefined
        };
      });

      setCustomers(enrichedCustomers);

      const totalCustomers = users.filter((user) => user.isActive).length;
      const vipCustomers = users.filter((user) => user.segment === 'vip').length;
      const totalSpent = enrichedCustomers.reduce((sum, customer) => sum + (customer.totalSpent || 0), 0);
      const avgCustomerValue = totalCustomers > 0 ? totalSpent / totalCustomers : 0;

      const returningCustomers = enrichedCustomers.filter((customer) => (customer.totalOrders || 0) > 1).length;
      const retentionRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0;

      setCustomerStats({
        totalCustomers,
        vipCustomers,
        avgCustomerValue,
        retentionRate
      });

    } catch (error) {
      console.error('Error fetching customer data:', error);
      setError('Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin mr-2" />
        <span>Loading customer data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customerStats.totalCustomers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Active registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customerStats.vipCustomers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">High-value customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Customer Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{Math.round(customerStats.avgCustomerValue).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Average spending per customer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customerStats.retentionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Customers with repeat orders</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>Customer Database</CardTitle>
              <CardDescription>Manage customer profiles and segmentation</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Segments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="loyal">Loyal</SelectItem>
                <SelectItem value="new-buyer">New Buyer</SelectItem>
                <SelectItem value="seasonal-shopper">Seasonal Shopper</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                customers
                  .filter(customer => {
                    const matchesSearch = customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesSegment = selectedSegment === 'all' || customer.segment === selectedSegment;
                    return matchesSearch && matchesSegment;
                  })
                  .map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{customer.fullName}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={customer.segment === 'vip' ? 'default' : 'secondary'}>
                          {customer.segment.charAt(0).toUpperCase() + customer.segment.slice(1).replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{customer.totalOrders || 0}</TableCell>
                      <TableCell>৳{(customer.totalSpent || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        {customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : 'No orders'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(customer)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{customer.fullName}</DialogTitle>
                                <DialogDescription>Customer Profile Details</DialogDescription>
                              </DialogHeader>
                              {selectedCustomer && <CustomerProfileView customer={selectedCustomer} />}
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setEditingCustomer(customer)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Customer - {customer.fullName}</DialogTitle>
                                <DialogDescription>Update customer details and segment</DialogDescription>
                              </DialogHeader>
                              {editingCustomer && (
                                <EditCustomerForm
                                  customer={editingCustomer}
                                  onClose={() => setEditingCustomer(null)}
                                  onUpdate={fetchCustomersData}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManagement;
