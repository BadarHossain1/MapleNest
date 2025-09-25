import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Megaphone, Plus, Users, DollarSign, TrendingUp, Eye, Edit, Trash2, Calendar, Mail, Target, ShoppingBag } from 'lucide-react';



export default function MarketingCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [campaignStats, setCampaignStats] = useState({});
  const [crmData, setCrmData] = useState({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    targetAudience: '',
    budget: '',
    startDate: '',
    endDate: '',
    message: { subject: '', body: '' },
    discount: { code: '', percentage: '', amount: '' }
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Fetch campaigns from backend
  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/campaigns`);
      if (response.ok) {
        const result = await response.json();
        setCampaigns(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  // Fetch campaign statistics
  const fetchCampaignStats = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/campaigns/stats`);
      if (response.ok) {
        const result = await response.json();
        setCampaignStats(result.data || {});
      }
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
    }
  };

  // Fetch CRM data from existing collections
  const fetchCrmData = async () => {
    try {
      // Fetch user stats
      const usersResponse = await fetch(`${apiUrl}/api/users/stats`);
      const usersData = usersResponse.ok ? await usersResponse.json() : { data: {} };

      // Fetch orders for revenue calculation
      const ordersResponse = await fetch(`${apiUrl}/api/orders`);
      const ordersData = ordersResponse.ok ? await ordersResponse.json() : { data: [] };

      // Calculate revenue metrics
      const orders = ordersData.data || [];
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const thisMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      });
      const monthlyRevenue = thisMonthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

      setCrmData({
        users: usersData.data || {},
        totalRevenue,
        monthlyRevenue,
        totalOrders: orders.length,
        monthlyOrders: thisMonthOrders.length,
        avgOrderValue
      });
    } catch (error) {
      console.error('Error fetching CRM data:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchCampaigns(),
        fetchCampaignStats(),
        fetchCrmData()
      ]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'draft': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleCreateCampaign = async () => {
    try {
      const campaignData = {
        ...formData,
        budget: parseFloat(formData.budget) || 0,
        discount: {
          ...formData.discount,
          percentage: parseFloat(formData.discount.percentage) || 0,
          amount: parseFloat(formData.discount.amount) || 0
        },
        createdBy: 'admin' // You can get this from auth context
      };

      const response = await fetch(`${apiUrl}/api/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData)
      });

      if (response.ok) {
        setShowCreateDialog(false);
        setFormData({
          name: '',
          description: '',
          type: '',
          targetAudience: '',
          budget: '',
          startDate: '',
          endDate: '',
          message: { subject: '', body: '' },
          discount: { code: '', percentage: '', amount: '' }
        });
        fetchCampaigns(); // Refresh the list
        fetchCampaignStats(); // Refresh stats
      } else {
        console.error('Failed to create campaign');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (confirm('Are you sure you want to cancel this campaign?')) {
      try {
        const response = await fetch(`${apiUrl}/api/campaigns/${campaignId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchCampaigns();
          fetchCampaignStats();
        }
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
  };

  const handleViewCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowViewDialog(true);
  };

  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name || '',
      description: campaign.description || '',
      type: campaign.type || '',
      targetAudience: campaign.targetAudience || '',
      budget: campaign.budget || '',
      startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : '',
      endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '',
      message: {
        subject: campaign.message?.subject || '',
        body: campaign.message?.body || ''
      },
      discount: {
        code: campaign.discount?.code || '',
        percentage: campaign.discount?.percentage || '',
        amount: campaign.discount?.amount || ''
      }
    });
    setShowEditDialog(true);
  };

  const handleUpdateCampaign = async () => {
    try {
      const campaignData = {
        ...formData,
        budget: parseFloat(formData.budget) || 0,
        discount: {
          ...formData.discount,
          percentage: parseFloat(formData.discount.percentage) || 0,
          amount: parseFloat(formData.discount.amount) || 0
        }
      };

      const response = await fetch(`${apiUrl}/api/campaigns/${selectedCampaign.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData)
      });

      if (response.ok) {
        setShowEditDialog(false);
        setSelectedCampaign(null);
        setFormData({
          name: '',
          description: '',
          type: '',
          targetAudience: '',
          budget: '',
          startDate: '',
          endDate: '',
          message: { subject: '', body: '' },
          discount: { code: '', percentage: '', amount: '' }
        });
        fetchCampaigns(); // Refresh the list
        fetchCampaignStats(); // Refresh stats
      } else {
        console.error('Failed to update campaign');
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  };

  // CRM Chart data
  const crmChartData = [
    { name: 'Total Users', value: crmData.users?.totalUsers || 0 },
    { name: 'Active Users', value: crmData.users?.activeUsers || 0 },
    { name: 'Total Orders', value: crmData.totalOrders || 0 },
    { name: 'Monthly Orders', value: crmData.monthlyOrders || 0 }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Marketing & CRM</h1>
          <p className="text-gray-600 mt-2">Manage marketing campaigns and analyze customer data</p>
        </div>
      </div>

      {/* CRM Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crmData.users?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {crmData.users?.activeUsers || 0} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{(crmData.totalRevenue || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              ৳{(crmData.monthlyRevenue || 0).toLocaleString()} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignStats.activeCampaigns || 0}</div>
            <p className="text-xs text-muted-foreground">
              {campaignStats.totalCampaigns || 0} total campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{(crmData.avgOrderValue || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {crmData.totalOrders || 0} total orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CRM Data Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Business Overview</CardTitle>
          <CardDescription>Key business metrics from your database</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={crmChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Campaign Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Campaign Management</CardTitle>
              <CardDescription>Create and manage your marketing campaigns</CardDescription>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                  <DialogDescription>
                    Set up a new marketing campaign with targeting and messaging.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input
                      id="campaign-name"
                      placeholder="Enter campaign name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign-type">Campaign Type</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem> */}
                        <SelectItem value="social-media">Social Media</SelectItem>
                        <SelectItem value="promotion">Promotion</SelectItem>
                        <SelectItem value="seasonal">Seasonal</SelectItem>
                        <SelectItem value="loyalty">Loyalty</SelectItem>
                        <SelectItem value="product-launch">Product Launch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target-audience">Target Audience</Label>
                    <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-customers">All Customers</SelectItem>
                        <SelectItem value="loyal">Loyal Customers</SelectItem>
                        <SelectItem value="new-buyers">New Buyers</SelectItem>
                        <SelectItem value="vip">VIP Customers</SelectItem>
                        <SelectItem value="seasonal-shoppers">Seasonal Shoppers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (৳)</Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="0.00"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter campaign description..."
                      rows={2}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message-subject">Subject</Label>
                    <Input
                      id="message-subject"
                      placeholder="Subject line"
                      value={formData.message.subject}
                      onChange={(e) => handleInputChange('message.subject', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount-code">Discount Code (Optional)</Label>
                    <Input
                      id="discount-code"
                      placeholder="DISCOUNT20"
                      value={formData.discount.code}
                      onChange={(e) => handleInputChange('discount.code', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount-percentage">Discount % (Optional)</Label>
                    <Input
                      id="discount-percentage"
                      type="number"
                      placeholder="20"
                      max="100"
                      value={formData.discount.percentage}
                      onChange={(e) => handleInputChange('discount.percentage', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount-amount">Discount Amount ৳ (Optional)</Label>
                    <Input
                      id="discount-amount"
                      type="number"
                      placeholder="10.00"
                      value={formData.discount.amount}
                      onChange={(e) => handleInputChange('discount.amount', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="message-body">Campaign Message</Label>
                    <Textarea
                      id="message-body"
                      placeholder="Enter your campaign message..."
                      rows={4}
                      value={formData.message.body}
                      onChange={(e) => handleInputChange('message.body', e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCampaign}>
                    Create Campaign
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No campaigns yet. Create your first campaign!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-muted-foreground">{campaign.targetAudience}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{campaign.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>৳{campaign.budget.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewCampaign(campaign)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCampaign(campaign)}
                          title="Edit Campaign"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          title="Delete Campaign"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Campaign Statistics */}
      {Object.keys(campaignStats).length > 0 && (
        <Card>
          {/* <CardHeader>
            <CardTitle>Campaign Statistics</CardTitle>
            <CardDescription>Overall campaign performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">{campaignStats.totalCampaigns}</div>
                <div className="text-sm text-muted-foreground">Total Campaigns</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{campaignStats.activeCampaigns}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{campaignStats.completedCampaigns}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              
            </div>
          </CardContent> */}
        </Card>
      )}

      {/* View Campaign Details Modal */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Campaign Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected campaign
            </DialogDescription>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Campaign Name</Label>
                        <p className="text-sm text-gray-900 mt-1">{selectedCampaign.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Description</Label>
                        <p className="text-sm text-gray-900 mt-1">{selectedCampaign.description || 'No description provided'}</p>
                      </div>
                      <div className="flex space-x-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Type</Label>
                          <div className="mt-1">
                            <Badge variant="outline">{selectedCampaign.type}</Badge>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Status</Label>
                          <div className="mt-1">
                            <Badge variant={getStatusBadgeVariant(selectedCampaign.status)}>
                              {selectedCampaign.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Details</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Target Audience</Label>
                        <p className="text-sm text-gray-900 mt-1">{selectedCampaign.targetAudience}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Budget</Label>
                        <p className="text-sm text-gray-900 mt-1">৳{selectedCampaign.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Campaign Period</Label>
                        <p className="text-sm text-gray-900 mt-1">
                          {new Date(selectedCampaign.startDate).toLocaleDateString()} - {new Date(selectedCampaign.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Created By</Label>
                        <p className="text-sm text-gray-900 mt-1">{selectedCampaign.createdBy}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              {(selectedCampaign.message?.subject || selectedCampaign.message?.body) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Content</h3>
                  <div className="space-y-3">
                    {selectedCampaign.message?.subject && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Subject</Label>
                        <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">{selectedCampaign.message.subject}</p>
                      </div>
                    )}
                    {selectedCampaign.message?.body && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Message Body</Label>
                        <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">{selectedCampaign.message.body}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Discount Information */}
              {(selectedCampaign.discount?.code || selectedCampaign.discount?.percentage > 0 || selectedCampaign.discount?.amount > 0) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Discount Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedCampaign.discount?.code && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Discount Code</Label>
                        <p className="text-sm text-gray-900 mt-1 font-mono bg-gray-100 px-2 py-1 rounded">{selectedCampaign.discount.code}</p>
                      </div>
                    )}
                    {selectedCampaign.discount?.percentage > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Percentage Discount</Label>
                        <p className="text-sm text-gray-900 mt-1">{selectedCampaign.discount.percentage}%</p>
                      </div>
                    )}
                    {selectedCampaign.discount?.amount > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Amount Discount</Label>
                        <p className="text-sm text-gray-900 mt-1">৳{selectedCampaign.discount.amount}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Performance Metrics */}
              {/* {selectedCampaign.metrics && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">{selectedCampaign.metrics.sent || 0}</div>
                      <div className="text-sm text-muted-foreground">Sent</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedCampaign.metrics.opened || 0}</div>
                      <div className="text-sm text-muted-foreground">Opened</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{selectedCampaign.metrics.clicked || 0}</div>
                      <div className="text-sm text-muted-foreground">Clicked</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedCampaign.metrics.conversions || 0}</div>
                      <div className="text-sm text-muted-foreground">Conversions</div>
                    </div>
                  </div>
                </div>
              )} */}

              {/* Timestamps */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Created At</Label>
                    <p className="text-sm text-gray-900 mt-1">{new Date(selectedCampaign.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Last Updated</Label>
                    <p className="text-sm text-gray-900 mt-1">{new Date(selectedCampaign.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Modal */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>
              Update campaign information and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-campaign-name">Campaign Name</Label>
              <Input
                id="edit-campaign-name"
                placeholder="Enter campaign name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-campaign-type">Campaign Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social-media">Social Media</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                  <SelectItem value="loyalty">Loyalty</SelectItem>
                  <SelectItem value="product-launch">Product Launch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-target-audience">Target Audience</Label>
              <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-customers">All Customers</SelectItem>
                  <SelectItem value="loyal">Loyal Customers</SelectItem>
                  <SelectItem value="new-buyers">New Buyers</SelectItem>
                  <SelectItem value="vip">VIP Customers</SelectItem>
                  <SelectItem value="seasonal-shoppers">Seasonal Shoppers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-budget">Budget (৳)</Label>
              <Input
                id="edit-budget"
                type="number"
                placeholder="0.00"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter campaign description..."
                rows={2}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-start-date">Start Date</Label>
              <Input
                id="edit-start-date"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-end-date">End Date</Label>
              <Input
                id="edit-end-date"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-message-subject">Subject</Label>
              <Input
                id="edit-message-subject"
                placeholder="Subject line"
                value={formData.message.subject}
                onChange={(e) => handleInputChange('message.subject', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-discount-code">Discount Code</Label>
              <Input
                id="edit-discount-code"
                placeholder="DISCOUNT20"
                value={formData.discount.code}
                onChange={(e) => handleInputChange('discount.code', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-discount-percentage">Discount %</Label>
              <Input
                id="edit-discount-percentage"
                type="number"
                placeholder="20"
                max="100"
                value={formData.discount.percentage}
                onChange={(e) => handleInputChange('discount.percentage', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-discount-amount">Discount Amount ৳</Label>
              <Input
                id="edit-discount-amount"
                type="number"
                placeholder="10.00"
                value={formData.discount.amount}
                onChange={(e) => handleInputChange('discount.amount', e.target.value)}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-message-body">Campaign Message</Label>
              <Textarea
                id="edit-message-body"
                placeholder="Enter your campaign message..."
                rows={4}
                value={formData.message.body}
                onChange={(e) => handleInputChange('message.body', e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCampaign}>
              Update Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
