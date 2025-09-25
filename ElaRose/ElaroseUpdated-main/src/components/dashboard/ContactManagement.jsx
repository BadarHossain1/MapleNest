import { useState, useEffect } from 'react';
import {
    Mail,
    Clock,
    CheckCircle2,
    AlertCircle,
    Trash2,
    Eye,
    RefreshCw,
    User,
    MessageCircle,
    Send
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';

export default function ContactManagement() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalContacts, setTotalContacts] = useState(0);
    const [statusCounts, setStatusCounts] = useState({});
    const [selectedContact, setSelectedContact] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10'
            });

            if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
            if (priorityFilter && priorityFilter !== 'all') params.append('priority', priorityFilter);
            if (searchTerm.trim()) params.append('search', searchTerm);

            const response = await fetch(`${apiUrl}/api/contacts?${params}`);
            const data = await response.json();

            if (data.success) {
                setContacts(data.data.contacts || data.data || []);
                setTotalPages(data.data.pagination?.totalPages || 1);
                setTotalContacts(data.data.pagination?.totalContacts || data.data?.length || 0);
                setStatusCounts(data.data.statusCounts || {});
            } else {
                // Mock data if API doesn't exist yet
                const mockContacts = [
                    {
                        _id: '1',
                        name: 'Sarah Johnson',
                        email: 'sarah.johnson@example.com',
                        subject: 'Product Inquiry',
                        message: 'Hi, I\'m interested in the elegant evening dress collection. Could you provide more details about sizing and availability?',
                        status: 'new',
                        priority: 'medium',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        _id: '2',
                        name: 'Michael Chen',
                        email: 'michael.chen@example.com',
                        subject: 'Order Issue',
                        message: 'I haven\'t received my order placed last week. The tracking number doesn\'t seem to work. Could you please help?',
                        status: 'in-progress',
                        priority: 'high',
                        createdAt: new Date(Date.now() - 86400000).toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        _id: '3',
                        name: 'Emma Rodriguez',
                        email: 'emma.r@example.com',
                        subject: 'Return Request',
                        message: 'I would like to return a dress I purchased. It doesn\'t fit as expected. What\'s your return policy?',
                        status: 'resolved',
                        priority: 'low',
                        createdAt: new Date(Date.now() - 172800000).toISOString(),
                        updatedAt: new Date(Date.now() - 86400000).toISOString()
                    }
                ];
                setContacts(mockContacts);
                setTotalContacts(mockContacts.length);
                setStatusCounts({
                    'new': 1,
                    'in-progress': 1,
                    'resolved': 1,
                    'closed': 0
                });
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
            setMessage({ type: 'error', text: 'Failed to fetch contacts' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [currentPage, statusFilter, priorityFilter]);

    const updateContactStatus = async (contactId, status, priority) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/contacts/${contactId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status, priority })
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Contact updated successfully' });
                fetchContacts();
            } else {
                throw new Error('Failed to update contact');
            }
        } catch (error) {
            console.error('Error updating contact:', error);
            setMessage({ type: 'error', text: 'Failed to update contact' });
        }
    };

    const deleteContact = async (contactId) => {
        if (!confirm('Are you sure you want to delete this contact? This action cannot be undone.')) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/contacts/${contactId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Contact deleted successfully' });
                fetchContacts();
            } else {
                throw new Error('Failed to delete contact');
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            setMessage({ type: 'error', text: 'Failed to delete contact' });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
            case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p>Loading contacts...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">Contact Management</h1>
                    <p className="text-gray-600 mt-2">Manage customer inquiries and support requests</p>
                </div>
                <Button onClick={fetchContacts} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Alert Messages */}
            {message.text && (
                <Alert className={`${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                        {message.text}
                    </AlertDescription>
                </Alert>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalContacts}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Messages</CardTitle>
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statusCounts.new || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statusCounts['in-progress'] || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statusCounts.resolved || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filter Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search contacts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="All Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priority</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Contacts List */}
            <div className="grid gap-4">
                {filteredContacts.map((contact) => (
                    <Card key={contact._id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <User className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{contact.name}</h3>
                                        <p className="text-sm text-gray-600">{contact.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className={getStatusColor(contact.status)}>
                                        {contact.status}
                                    </Badge>
                                    <Badge variant="outline" className={getPriorityColor(contact.priority)}>
                                        {contact.priority}
                                    </Badge>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">{contact.subject}</h4>
                                <p className="text-gray-600 text-sm line-clamp-2">{contact.message}</p>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="text-xs text-gray-500">
                                    Created: {new Date(contact.createdAt).toLocaleDateString()}
                                    {contact.updatedAt && (
                                        <span className="ml-4">
                                            Updated: {new Date(contact.updatedAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>

                                <div className="flex space-x-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" onClick={() => setSelectedContact(contact)}>
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>Contact Details</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium">Name</label>
                                                        <p className="text-sm text-gray-600">{contact.name}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium">Email</label>
                                                        <p className="text-sm text-gray-600">{contact.email}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">Subject</label>
                                                    <p className="text-sm text-gray-600">{contact.subject}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">Message</label>
                                                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{contact.message}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium">Status</label>
                                                        <Select 
                                                            value={contact.status} 
                                                            onValueChange={(value) => updateContactStatus(contact._id, value, contact.priority)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="new">New</SelectItem>
                                                                <SelectItem value="in-progress">In Progress</SelectItem>
                                                                <SelectItem value="resolved">Resolved</SelectItem>
                                                                <SelectItem value="closed">Closed</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium">Priority</label>
                                                        <Select 
                                                            value={contact.priority} 
                                                            onValueChange={(value) => updateContactStatus(contact._id, contact.status, value)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="urgent">Urgent</SelectItem>
                                                                <SelectItem value="high">High</SelectItem>
                                                                <SelectItem value="medium">Medium</SelectItem>
                                                                <SelectItem value="low">Low</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <Button 
                                        variant="destructive" 
                                        size="sm" 
                                        onClick={() => deleteContact(contact._id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredContacts.length === 0 && (
                <Card>
                    <CardContent className="text-center py-12">
                        <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
                        <p className="text-gray-600">No contacts match your current filters.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
