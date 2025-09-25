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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { MessageSquare, Plus, Search, Clock, CheckCircle, AlertCircle, RefreshCw, Mail, Phone, MessageCircle, Star, ArrowLeft, Send, User, Package, Calendar, ShoppingBag, Loader2, Trash2, X } from 'lucide-react';
import { useAdminSupport } from '@/hooks/useAdminSupport';

export default function CustomerSupport() {
  const {
    tickets,
    selectedTicket,
    loading,
    error,
    fetchAllTickets,
    sendReply,
    updateTicketMetadata,
    deleteTicket,
    getTicketStats,
    setSelectedTicket
  } = useAdminSupport();

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Reviews state
  const [customerReviews, setCustomerReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState('');

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'destructive';
      case 'in-progress': return 'secondary';
      case 'pending': return 'secondary';
      case 'resolved': return 'default';
      case 'closed': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'destructive';
      case 'urgent': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return <AlertCircle className="h-4 w-4" />;
      case 'in-progress': return <RefreshCw className="h-4 w-4" />;
      case 'pending': return <RefreshCw className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Load tickets on component mount
  useEffect(() => {
    fetchAllTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket || sending) return;

    setSending(true);
    try {
      const replyData = {
        text: newMessage.trim(),
        adminName: 'Support Agent', // In a real app, get from auth context
        timestamp: new Date().toISOString(),
        isRead: false
      };

      const result = await sendReply(selectedTicket._id, replyData);
      if (result.success) {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSending(false);
    }
  };

  const handleUpdateTicket = async (updates) => {
    if (!selectedTicket) return;

    try {
      const result = await updateTicketMetadata(selectedTicket._id, updates);
      return result.success;
    } catch (error) {
      console.error('Error updating ticket:', error);
      return false;
    }
  };

  const handleDeleteTicket = async (ticketId, e) => {
    e.stopPropagation(); // Prevent row click event

    if (!confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await deleteTicket(ticketId);

      if (result.success) {
        alert('Ticket deleted successfully!');
      } else {
        alert(result.error || 'Error deleting ticket. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      alert('Error deleting ticket. Please try again.');
    }
  }; const stats = getTicketStats();

  // Render conversation messages and replies in chronological order
  const renderConversation = (ticket) => {
    if (!ticket) return [];

    const allMessages = [];

    // Add customer messages
    if (ticket.messages && Array.isArray(ticket.messages)) {
      ticket.messages.forEach((msg, index) => {
        allMessages.push({
          ...msg,
          type: 'customer',
          id: `msg-${index}`,
          sender: ticket.userDetails?.name || 'Customer'
        });
      });
    }

    // Add admin replies
    if (ticket.replies && Array.isArray(ticket.replies)) {
      ticket.replies.forEach((reply, index) => {
        allMessages.push({
          ...reply,
          type: 'support',
          id: `reply-${index}`,
          sender: reply.adminName || 'Support Agent',
          message: reply.text
        });
      });
    }

    // Sort by timestamp
    allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return allMessages.map((message) => (
      <div
        key={message.id}
        className={`flex gap-3 ${message.type === 'support' ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`flex gap-3 max-w-[80%] ${message.type === 'support' ? 'flex-row-reverse' : 'flex-row'}`}>
          <Avatar className="w-8 h-8">
            <AvatarFallback>
              {message.type === 'support' ? 'S' : 'C'}
            </AvatarFallback>
          </Avatar>
          <div className={`p-3 rounded-lg ${message.type === 'support' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'}`}>
            <div className="text-sm font-medium mb-1">{message.sender}</div>
            <div className="text-sm">{message.text || message.message}</div>
            <div className="text-xs opacity-70 mt-1">
              {new Date(message.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    ));
  };

  // Fetch reviews from the API
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      setReviewsError('');

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://elarose-server.onrender.com';
      const response = await fetch(`${apiUrl}/api/reviews/recent?limit=20`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setCustomerReviews(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviewsError('Failed to load reviews. Please try again.');
    } finally {
      setReviewsLoading(false);
    }
  };

  // Load reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []); return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Customer Support</h1>
          <p className="text-gray-600 mt-2">Manage support tickets, reviews, and customer interactions</p>
        </div>
      </div>

      {/* Support Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats.byStatus['open'] || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats.byStatus['in-progress'] || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Being handled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats.byStatus['resolved'] || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `${stats.avgResponseTime}h`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          {selectedTicket ? (
            // Ticket Detail View
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTicket(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(selectedTicket.status)}
                        Order #{selectedTicket.orderNumber || selectedTicket._id?.slice(-6)} Support
                      </CardTitle>
                      <CardDescription>
                        Ticket ID: {selectedTicket._id?.slice(-6)} • {selectedTicket.userDetails?.name || 'Unknown Customer'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityBadgeVariant(selectedTicket.priority)}>
                      {selectedTicket.priority || 'Medium'}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(selectedTicket.status)}>
                      {selectedTicket.status || 'Open'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Messages */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {renderConversation(selectedTicket)}
                    </div>

                    {/* Message Input */}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type your response..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                        rows={3}
                        disabled={sending}
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="px-4"
                        disabled={!newMessage.trim() || sending}
                      >
                        {sending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Ticket Details */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Ticket Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Customer</Label>
                          <div className="text-sm">{selectedTicket.userDetails?.name || 'Unknown'}</div>
                          <div className="text-xs text-muted-foreground">{selectedTicket.userDetails?.email || 'No email'}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Order</Label>
                          <div className="text-sm">#{selectedTicket.orderNumber || selectedTicket.orderId?.slice(-6) || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground">৳{selectedTicket.orderDetails?.totalAmount?.toFixed(2) || '0.00'}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Category</Label>
                          <Select
                            value={selectedTicket.category || 'general'}
                            onValueChange={(value) => handleUpdateTicket({ category: value })}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="order">Order Issue</SelectItem>
                              <SelectItem value="product">Product Issue</SelectItem>
                              <SelectItem value="shipping">Shipping</SelectItem>
                              <SelectItem value="return">Return/Exchange</SelectItem>
                              <SelectItem value="billing">Billing</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Priority</Label>
                          <Select
                            value={selectedTicket.priority || 'medium'}
                            onValueChange={(value) => handleUpdateTicket({ priority: value })}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Status</Label>
                          <Select
                            value={selectedTicket.status || 'open'}
                            onValueChange={(value) => handleUpdateTicket({ status: value })}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Assigned To</Label>
                          <div className="relative">
                            <Input
                              value={selectedTicket.assignedTo || ''}
                              onChange={(e) => handleUpdateTicket({ assignedTo: e.target.value })}
                              placeholder="Enter agent name"
                              className="pr-8"
                            />
                            {selectedTicket.assignedTo && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateTicket({ assignedTo: '' })}
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Created</Label>
                          <div className="text-sm">{new Date(selectedTicket.createdAt).toLocaleString()}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Last Updated</Label>
                          <div className="text-sm">{new Date(selectedTicket.lastUpdate).toLocaleString()}</div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button className="w-full" variant="outline">
                          Change Status
                        </Button>
                        <Button className="w-full" variant="outline">
                          Reassign Ticket
                        </Button>
                        <Button className="w-full" variant="outline">
                          Add Internal Note
                        </Button>
                        <Button className="w-full" variant="outline">
                          View Customer Profile
                        </Button>
                      </CardContent>
                    </Card> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Tickets List View
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Support Tickets</CardTitle>
                    <CardDescription>Manage customer inquiries and support requests</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search tickets..." className="pl-8" />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                          <p className="text-muted-foreground">Loading tickets...</p>
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                          <p className="text-red-500">{error}</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredTickets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <MessageCircle className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No support tickets found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTickets.map((ticket) => (
                        <TableRow
                          key={ticket._id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <TableCell>
                            <div>
                              <div className="font-medium">#{ticket.orderNumber || ticket._id.slice(-6)}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {ticket.messages?.[0]?.message?.substring(0, 50) || 'No messages'}...
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{ticket.userDetails?.name || 'Unknown'}</div>
                              <div className="text-sm text-muted-foreground">{ticket.userDetails?.email || 'No email'}</div>
                            </div>
                          </TableCell>
                          <TableCell>{ticket.category || 'General'}</TableCell>
                          <TableCell>
                            <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
                              {ticket.priority || 'Medium'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(ticket.status)}
                              <Badge variant={getStatusBadgeVariant(ticket.status)}>
                                {ticket.status || 'Open'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>{ticket.assignedTo || 'Unassigned'}</TableCell>
                          <TableCell>
                            {new Date(ticket.lastUpdate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDeleteTicket(ticket._id, e)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-[#f2c9c7]" />
                  Customer Reviews & Feedback
                </CardTitle>
                <CardDescription>Monitor and respond to customer reviews from the reviews subcollection</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchReviews}
                disabled={reviewsLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${reviewsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {reviewsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f2c9c7]"></div>
                  <span className="ml-3 text-gray-600">Loading reviews...</span>
                </div>
              ) : reviewsError ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 mb-4">{reviewsError}</p>
                  <Button onClick={fetchReviews} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : customerReviews.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No reviews found</p>
                  <p className="text-sm text-gray-500">Customer reviews will appear here once they start reviewing products</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {customerReviews.map((review) => (
                    <Card key={review.id} className="border-l-4 border-l-[#f2c9c7] hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                              {review.productImage ? (
                                <img
                                  src={review.productImage}
                                  alt={review.product}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className="w-full h-full bg-gradient-to-br from-[#f2c9c7] to-[#e8b4b1] flex items-center justify-center" style={{ display: review.productImage ? 'none' : 'flex' }}>
                                <Package className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          </div>

                          {/* Review Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback className="bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] text-white">
                                    {review.customer.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-semibold text-gray-900">{review.userName}</div>
                                  <div className="text-sm text-gray-600">{review.userEmail}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {review.verified && (
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {review.status || 'Approved'}
                                </Badge>
                              </div>
                            </div>

                            {/* Product Info */}
                            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <ShoppingBag className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium text-gray-900">{review.product}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Package className="h-3 w-3" />
                                    {review.category}
                                  </span>
                                  <span className="font-semibold text-[#8B5446]">
                                    ৳{review.productPrice}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Review Comment */}
                            <p className="text-gray-700 leading-relaxed mb-4 bg-white p-3 rounded-lg border border-gray-100">
                              "{review.comment}"
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(review.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {new Date(review.postTime || review.date).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              {/* <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="hover:bg-[#f2c9c7] hover:text-white">
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Respond
                                </Button>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                                  <User className="h-4 w-4 mr-1" />
                                  Contact
                                </Button>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Show count */}
                  <div className="text-center py-4 text-sm text-gray-600 border-t">
                    Showing {customerReviews.length} recent reviews
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>Frequently asked questions and common solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sizing & Fit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• How to choose the right size</li>
                      <li>• Size chart and measurements</li>
                      <li>• Fit guide for different styles</li>
                      <li>• What to do if size doesn't fit</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Orders & Shipping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Order tracking information</li>
                      <li>• Shipping times and costs</li>
                      <li>• International shipping</li>
                      <li>• Order modification policies</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Returns & Exchanges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Return policy and timeframe</li>
                      <li>• How to initiate a return</li>
                      <li>• Exchange process</li>
                      <li>• Refund processing times</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Care Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Washing and care guidelines</li>
                      <li>• Fabric-specific instructions</li>
                      <li>• Storage recommendations</li>
                      <li>• Stain removal tips</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
