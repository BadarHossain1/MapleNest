# Customer Support Chat System Documentation

## Overview
The customer support chat system allows customers to communicate with administrators regarding their orders. Messages are stored in MongoDB and displayed in a real-time chat interface.

## Features
- **Order-specific conversations**: Each chat is tied to a specific order
- **Real-time messaging**: Customers and admins can exchange messages
- **Message history**: All conversations are preserved
- **Read status tracking**: Track which messages have been read
- **User identification**: Messages show sender details and timestamps

## Database Schema

### Collection: `support`
```javascript
{
  orderId: String,           // Order ID this conversation relates to
  orderNumber: String,       // Short order number for display
  userDetails: {             // Customer information
    id: String,
    name: String,
    email: String,
    profileImage: String
  },
  orderDetails: {            // Order information
    id: String,
    totalAmount: Number,
    status: String,
    createdAt: Date,
    items: [...]
  },
  message: String,           // The actual message content
  sender: String,            // 'customer' or 'admin'
  timestamp: Date,           // When message was sent
  isRead: Boolean,           // Whether message has been read
  adminDetails: {            // Admin information (for admin messages)
    id: String,
    name: String,
    email: String
  },
  threadId: String           // Groups messages for same order conversation
}
```

## API Endpoints

### Customer Endpoints
- `GET /api/support/:orderId?userEmail=...` - Get messages for an order
- `POST /api/support` - Send a new message
- `PUT /api/support/:orderId/read` - Mark messages as read

### Admin Endpoints
- `GET /api/support/admin/conversations` - Get all conversations
- `GET /api/support/admin/conversation/:threadId` - Get specific conversation

## Frontend Components

### CustomerSupportModal
Location: `src/components/ui/customer-support-modal.jsx`

**Props:**
- `isOpen`: Boolean - Controls modal visibility
- `onClose`: Function - Close modal callback
- `order`: Object - Order information
- `user`: Object - User information

**Features:**
- Chat interface with message bubbles
- Real-time message sending
- Auto-scroll to latest messages
- Message status indicators
- Responsive design with animations

### useSupport Hook
Location: `src/hooks/useSupport.js`

**Functions:**
- `fetchMessages(orderId, userEmail)` - Get conversation history
- `sendMessage(messageData)` - Send new message
- `markAsRead(orderId, userEmail)` - Mark messages as read

## Usage

### For Customers
1. Go to "My Account" → "Orders"
2. Click "Message Support" on any order
3. Type message and press Enter or click Send
4. Messages appear instantly in the chat

### For Admins (Future Implementation)
1. Access admin dashboard
2. View support conversations
3. Click on conversation to reply
4. Send messages that appear to customers

## Message Flow

1. **Customer sends message:**
   - Message stored with sender: 'customer'
   - Order and user details included
   - Thread ID created for grouping

2. **Admin replies:**
   - Message stored with sender: 'admin'
   - Same thread ID for grouping
   - Admin details included

3. **Message display:**
   - Messages grouped by thread ID
   - Sorted by timestamp
   - Different styling for customer vs admin messages

## Security Considerations

- Messages are tied to specific user emails
- Customers can only see their own conversations
- Admin access requires separate authentication
- Input validation on all message fields

## Future Enhancements

1. **Real-time notifications** using WebSockets
2. **File attachments** in messages
3. **Message encryption** for sensitive data
4. **Auto-replies** for common questions
5. **Admin dashboard** for managing conversations
6. **Message search** functionality
7. **Conversation tagging** and categorization