import { useState } from 'react';

export const useAdminSupport = () => {
    const [loading, setLoading] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [error, setError] = useState(null);

    // Fetch all support tickets for admin dashboard
    const fetchAllTickets = async () => {
        try {
            setLoading(true);
            setError(null);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/support/admin/conversations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                setTickets(result.data || []);
                return { success: true, data: result.data };
            } else {
                setError(result.message || 'Failed to fetch tickets');
                return { success: false, error: result.message };
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
            setError('Failed to fetch tickets');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Send admin reply to a ticket
    const sendReply = async (ticketId, replyData) => {
        try {
            setLoading(true);
            setError(null);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/support/admin/ticket/${ticketId}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(replyData),
            });

            const result = await response.json();

            if (result.success) {
                // Update the selected ticket with the new reply
                if (selectedTicket && selectedTicket._id === ticketId) {
                    setSelectedTicket(result.data);
                }

                // Update tickets list
                setTickets(prev => prev.map(ticket =>
                    ticket._id === ticketId ? result.data : ticket
                ));

                return { success: true, data: result.data };
            } else {
                setError(result.message || 'Failed to send reply');
                return { success: false, error: result.message };
            }
        } catch (error) {
            console.error('Error sending reply:', error);
            setError('Failed to send reply');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Update ticket metadata (status, priority, category, assignedTo)
    const updateTicketMetadata = async (ticketId, updateData) => {
        try {
            setLoading(true);
            setError(null);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/support/admin/ticket/${ticketId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            const result = await response.json();

            if (result.success) {
                // Update the selected ticket
                if (selectedTicket && selectedTicket._id === ticketId) {
                    setSelectedTicket(result.data);
                }

                // Update tickets list
                setTickets(prev => prev.map(ticket =>
                    ticket._id === ticketId ? result.data : ticket
                ));

                return { success: true, data: result.data };
            } else {
                setError(result.message || 'Failed to update ticket');
                return { success: false, error: result.message };
            }
        } catch (error) {
            console.error('Error updating ticket:', error);
            setError('Failed to update ticket');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Delete a support ticket
    const deleteTicket = async (ticketId) => {
        try {
            setLoading(true);
            setError(null);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/support/admin/ticket/${ticketId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                // Remove the ticket from the tickets list
                setTickets(prev => prev.filter(ticket => ticket._id !== ticketId));

                // If this was the selected ticket, clear the selection
                if (selectedTicket && selectedTicket._id === ticketId) {
                    setSelectedTicket(null);
                }

                return { success: true, message: result.message };
            } else {
                setError(result.message || 'Failed to delete ticket');
                return { success: false, error: result.message };
            }
        } catch (error) {
            console.error('Error deleting ticket:', error);
            setError('Failed to delete ticket');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Get ticket statistics
    const getTicketStats = () => {
        const stats = tickets.reduce((acc, ticket) => {
            // Count by status
            acc.byStatus[ticket.status] = (acc.byStatus[ticket.status] || 0) + 1;

            // Count by priority
            acc.byPriority[ticket.priority] = (acc.byPriority[ticket.priority] || 0) + 1;

            // Count by category
            acc.byCategory[ticket.category] = (acc.byCategory[ticket.category] || 0) + 1;

            // Calculate response times (simplified)
            const created = new Date(ticket.createdAt);
            const lastUpdate = new Date(ticket.lastUpdate);
            const responseTime = Math.abs(lastUpdate - created) / (1000 * 60 * 60); // hours
            acc.responseTimes.push(responseTime);

            return acc;
        }, {
            byStatus: {},
            byPriority: {},
            byCategory: {},
            responseTimes: []
        });

        // Calculate average response time
        const avgResponseTime = stats.responseTimes.length > 0
            ? stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length
            : 0;

        return {
            ...stats,
            total: tickets.length,
            avgResponseTime: avgResponseTime.toFixed(1)
        };
    };

    return {
        tickets,
        selectedTicket,
        loading,
        error,
        fetchAllTickets,
        sendReply,
        updateTicketMetadata,
        deleteTicket,
        getTicketStats,
        setSelectedTicket,
        setTickets
    };
};