# Razorpay Payment Integration

This document outlines the Razorpay payment integration for the "Get Listed" feature in the Quickk WebnClub application.

## Overview

The integration allows users to pay ₹399 (including GST) to get listed in the community directory. Upon successful payment, the user's `listed` field is set to `true` in the database.

## Features

- 🔐 Secure payment processing via Razorpay
- ✅ Payment signature verification (client-side and webhook)
- 📊 Payment history tracking
- 🔔 Real-time webhook notifications
- 💾 Complete audit trail of all transactions
- 🎯 Automatic user listing status update

## Architecture

### Backend (Server)

#### Modules Created
- **Payment Model** (`server/src/modules/payment/model/payment.model.ts`)
  - Stores payment records with Razorpay IDs, amounts, status, and purpose
  
- **Payment Service** (`server/src/modules/payment/service/payment.service.ts`)
  - `createOrder()`: Creates Razorpay order
  - `verifyPayment()`: Verifies payment signature from client
  - `handleWebhook()`: Processes Razorpay webhooks (primary source of truth)
  - `updateUserListingStatus()`: Updates user's listed status
  
- **Payment Controller** (`server/src/modules/payment/controller/payment.controller.ts`)
  - Handles HTTP requests for payment operations
  
- **Payment Routes** (`server/src/modules/payment/route/payment.routes.ts`)
  - `POST /api/v1/payment/create-order` - Create payment order (authenticated)
  - `POST /api/v1/payment/verify` - Verify payment (authenticated)
  - `POST /api/v1/payment/webhook` - Handle Razorpay webhooks (public)
  - `GET /api/v1/payment/history` - Get payment history (authenticated)
  - `GET /api/v1/payment/:id` - Get payment by ID (authenticated)

#### Payment Statuses
- `CREATED` - Order created but payment not initiated
- `AUTHORIZED` - Payment authorized but not captured
- `CAPTURED` - Payment successful
- `FAILED` - Payment failed
- `REFUNDED` - Payment refunded

#### Payment Purposes
- `LISTING` - Get listed in community directory
- `MEMBERSHIP` - WebnClub membership (future use)
- `EVENT` - Event registration (future use)

### Frontend (Client)

#### Components Modified
- **GetListed Component** (`client/src/features/events/components/GetListed.tsx`)
  - Loads Razorpay script dynamically
  - Initiates payment on button click
  - Handles payment success/failure
  - Shows loading states and notifications

#### API Integration
- **Payment API** (`client/src/features/payment/api/paymentApi.ts`)
  - RTK Query mutations for `createOrder` and `verifyPayment`
  - Queries for payment history

## Environment Variables

### Server (.env)
```bash
# Razorpay Configuration
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"
```

### Client (.env)
```bash
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID="your_razorpay_key_id"
```

## Setup Instructions

### 1. Razorpay Account Setup

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings** → **API Keys**
3. Generate API Keys (Test Mode for development)
4. Copy `Key ID` and `Key Secret`

### 2. Webhook Configuration

1. Go to **Settings** → **Webhooks** in Razorpay Dashboard
2. Click **Create Webhook**
3. Add webhook URL: `https://your-domain.com/api/v1/payment/webhook`
4. Select events to subscribe:
   - `payment.captured`
   - `payment.failed`
   - `payment.authorized`
5. Set an active status
6. Copy the **Webhook Secret**

### 3. Environment Setup

#### Server
```bash
cd server
cp .env.example .env
# Edit .env and add your Razorpay credentials
```

#### Client
```bash
cd client
cp .env.example .env
# Edit .env and add your Razorpay Key ID
```

### 4. Install Dependencies

Dependencies are already installed via the integration script:
- Server: `razorpay` package

### 5. Test the Integration

#### Development Testing (Test Mode)
1. Start the server: `cd server && npm run dev`
2. Start the client: `cd client && npm run dev`
3. Navigate to the "Get Listed" page
4. Click "Pay ₹399"
5. Use Razorpay test cards:
   - Success: `4111 1111 1111 1111`
   - Failure: `4000 0000 0000 0002`
   - CVV: Any 3 digits
   - Expiry: Any future date

## Payment Flow

```
User clicks "Pay" 
    ↓
Frontend calls /api/v1/payment/create-order
    ↓
Backend creates Razorpay order
    ↓
Frontend opens Razorpay checkout modal
    ↓
User enters payment details
    ↓
Razorpay processes payment
    ↓
Two paths (redundant verification):
    ├─→ Frontend calls /api/v1/payment/verify (immediate)
    └─→ Razorpay sends webhook to /api/v1/payment/webhook (reliable)
    ↓
Backend verifies signature & updates user.listed = true
    ↓
User receives confirmation
```

## Security Features

1. **Signature Verification**
   - All payments are verified using HMAC SHA256 signature
   - Both client callback and webhook are verified independently

2. **Webhook Security**
   - Webhook signature verification using Razorpay webhook secret
   - Only valid webhooks update payment status

3. **Authentication**
   - All payment APIs (except webhook) require user authentication
   - User can only verify their own payments

4. **Amount Validation**
   - Listing purpose enforces ₹399 amount
   - Prevents arbitrary amounts

## Database Schema

### Payment Collection
```typescript
{
  userId: ObjectId,              // Reference to User
  razorpayOrderId: String,       // Unique order ID from Razorpay
  razorpayPaymentId: String,     // Payment ID after successful payment
  razorpaySignature: String,     // Payment signature for verification
  amount: Number,                // Amount in rupees (399)
  currency: String,              // Currency code (INR)
  status: String,                // Payment status enum
  purpose: String,               // Payment purpose enum
  metadata: Object,              // Additional data
  createdAt: Date,
  updatedAt: Date
}
```

### User Model Update
```typescript
{
  // ... existing fields
  listed: Boolean,               // New field - default: false
}
```

## Error Handling

The integration includes comprehensive error handling:
- Network failures
- Payment gateway errors
- Signature verification failures
- Database errors
- User-friendly error messages via snackbar notifications

## Testing Checklist

- [ ] Payment order creation works
- [ ] Razorpay checkout modal opens
- [ ] Test card payment succeeds
- [ ] Payment verification works
- [ ] User.listed field updates to true
- [ ] Webhook receives and processes events
- [ ] Payment history displays correctly
- [ ] Failed payments are handled gracefully
- [ ] Cancelled payments show appropriate message
- [ ] Loading states work correctly

## Future Enhancements

1. **Multiple Payment Purposes**
   - Membership fees
   - Event registrations
   - Resource purchases

2. **Payment Plans**
   - Subscription-based listing
   - Tiered pricing

3. **Refund Management**
   - Admin interface for refunds
   - Automatic refund processing

4. **Payment Analytics**
   - Revenue dashboard
   - Payment success rate tracking

## Troubleshooting

### Payment fails but money is debited
- Check webhook logs in Razorpay dashboard
- Verify webhook URL is accessible
- Check server logs for webhook processing errors
- Webhook will automatically update payment status

### Webhook not receiving events
- Verify webhook URL is publicly accessible (use ngrok for local testing)
- Check webhook secret is correct
- Ensure webhook is in "Active" status in Razorpay dashboard

### "Payment verification failed" error
- Ensure RAZORPAY_KEY_SECRET is correct in server .env
- Check if order_id matches in request
- Verify signature calculation logic

## Support

For issues related to:
- **Razorpay**: Check [Razorpay Documentation](https://razorpay.com/docs/)
- **Integration**: Contact development team
- **Payment disputes**: Use Razorpay Dashboard → Disputes section

## License

This integration is part of the Quickk WebnClub application.
