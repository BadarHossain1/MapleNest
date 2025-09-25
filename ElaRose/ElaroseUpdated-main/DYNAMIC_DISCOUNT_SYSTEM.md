# Dynamic Discount Banner System

## Overview
The ElaRose website now features a dynamic discount banner in the header that automatically fetches and displays active discount codes from the database, replacing the hardcoded "FREESHIP" code.

## Features

### 🎯 Dynamic Content
- Fetches active discount codes from the database in real-time
- Automatically rotates through multiple active discounts every 5 seconds
- Displays appropriate messaging based on discount type (percentage, fixed amount, free shipping)

### 🔄 Smart Rotation
- If multiple discounts are active, they rotate automatically
- If only one discount is active, it displays statically
- Smooth fade transitions between different discount messages

### 🛡️ Fallback System
- If no active discounts are found, displays default "FREESHIP" message
- If API fails, gracefully falls back to default message
- Loading state shows "Loading offers..." while fetching

## Implementation

### Backend Changes

#### New API Endpoint
```
GET /api/discounts/active
```

**Purpose**: Fetches currently active discount codes for public display

**Response Format**:
```json
{
  "success": true,
  "message": "Active discounts retrieved successfully",
  "data": [
    {
      "code": "SUMMER25",
      "name": "Summer Sale",
      "description": "25% off all summer items",
      "type": "percentage",
      "value": 25,
      "minOrderAmount": 50,
      "freeDelivery": false
    }
  ]
}
```

**Filtering Logic**:
- `isActive: true`
- `validFrom <= now <= validUntil`
- Usage limit not exceeded (if applicable)
- Limited to 5 most recent discounts

#### Controller Method
**File**: `backend/Controllers/discountController.js`
**Method**: `getActiveDiscounts`

### Frontend Changes

#### Custom Hook: `useDiscounts`
**File**: `src/hooks/useDiscounts.js`

**Features**:
- Fetches active discounts on component mount
- Handles rotation logic for multiple discounts
- Formats discount messages intelligently
- Provides fallback handling

#### Components

**DiscountBanner Component**
**File**: `src/components/DiscountBanner.jsx`
- Handles smooth transitions between discount messages
- Provides animation effects for rotating content

**Header Component Updates**
**File**: `src/components/Header.jsx`
- Integrated `useDiscounts` hook
- Added loading states
- Replaced hardcoded discount with dynamic content

## Message Formatting

The system intelligently formats discount messages based on discount type:

### Free Delivery Discounts
```
"Free shipping on orders over $100 | Use code: FREESHIP"
```

### Percentage Discounts
```
"25% off orders over $50 | Use code: SUMMER25"
```

### Fixed Amount Discounts
```
"$10 off orders over $75 | Use code: SAVE10"
```

### Custom Description
```
"Special holiday offer | Use code: HOLIDAY2024"
```

## Database Schema

The discount system uses the existing `Discount` model with these key fields:

```javascript
{
  code: String,           // Discount code (e.g., "SUMMER25")
  name: String,           // Display name
  description: String,    // Custom description
  type: String,           // "percentage" or "fixed"
  value: Number,          // Discount value
  minOrderAmount: Number, // Minimum order requirement
  freeDelivery: Boolean,  // Whether it includes free delivery
  isActive: Boolean,      // Active status
  validFrom: Date,        // Start date
  validUntil: Date,       // End date
  usageLimit: Number,     // Max uses (null = unlimited)
  usedCount: Number       // Current usage count
}
```

## Usage Examples

### Admin Creates New Discount
1. Admin creates discount in admin panel
2. Sets `isActive: true` and valid date range
3. Discount automatically appears in header banner within 5 seconds (on next component mount)

### Multiple Active Discounts
- System rotates between all active discounts
- Each discount shows for 5 seconds
- Smooth fade transition between messages

### API Failure Handling
- If backend is down: Shows fallback "FREESHIP" message
- If no active discounts: Shows default free shipping offer
- Loading state prevents empty banner

## Performance Considerations

- API call happens only on component mount, not on every render
- Rotation handled client-side with `setInterval`
- Component unmount cleans up intervals
- Minimal re-renders with proper state management

## Future Enhancements

1. **Admin Preview**: Allow admins to preview how discounts will appear
2. **Targeting**: Show different discounts based on user location/history
3. **A/B Testing**: Test different discount messages
4. **Analytics**: Track which discounts drive most clicks
5. **Real-time Updates**: WebSocket connection for instant discount updates