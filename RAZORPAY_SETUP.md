# Quick Setup Guide - Razorpay Integration

## 🚀 Quick Start (5 Minutes)

### Step 1: Get Razorpay Credentials

1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or login
3. Go to **Settings** → **API Keys** → **Generate Test Keys**
4. Copy:
   - Key ID (e.g., `rzp_test_xxxxxxxxxxxxx`)
   - Key Secret (e.g., `xxxxxxxxxxxxxxxxxxxxx`)

### Step 2: Configure Server Environment

```bash
cd server
nano .env  # or use your preferred editor
```

Add these lines to your `.env`:
```bash
RAZORPAY_KEY_ID="rzp_test_your_key_id_here"
RAZORPAY_KEY_SECRET="your_key_secret_here"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret_here"
```

### Step 3: Configure Client Environment

```bash
cd ../client
nano .env  # or use your preferred editor
```

Add this line to your `.env`:
```bash
VITE_RAZORPAY_KEY_ID="rzp_test_your_key_id_here"
```

### Step 4: Setup Webhook (Important!)

1. Go to Razorpay Dashboard → **Settings** → **Webhooks**
2. Click **Create Webhook**
3. Fill in:
   - **Webhook URL**: `https://your-domain.com/api/v1/payment/webhook`
     - For local testing, use [ngrok](https://ngrok.com/): `https://xxxxx.ngrok.io/api/v1/payment/webhook`
   - **Alert Email**: Your email
   - **Active Status**: ✓ Enabled
   - **Events**: Select these:
     - ✓ payment.authorized
     - ✓ payment.captured
     - ✓ payment.failed
4. Click **Create Webhook**
5. Copy the **Webhook Secret** and add it to server `.env`

### Step 5: Start the Application

```bash
# Terminal 1 - Start Server
cd server
npm run dev

# Terminal 2 - Start Client
cd client
npm run dev
```

### Step 6: Test Payment

1. Open browser and navigate to the "Get Listed" page
2. Click **Pay ₹399** button
3. Use Razorpay test card:
   - **Card Number**: `4111 1111 1111 1111`
   - **Expiry**: Any future date (e.g., `12/25`)
   - **CVV**: Any 3 digits (e.g., `123`)
   - **Name**: Any name
4. Click **Pay**
5. ✅ Payment successful! User is now listed.

## 🧪 Test Cards

| Scenario | Card Number | Result |
|----------|-------------|---------|
| Success | `4111 1111 1111 1111` | ✅ Payment captured |
| Failure | `4000 0000 0000 0002` | ❌ Payment failed |
| Authorized | `5104 0600 0000 0008` | ⏳ Payment authorized (not captured) |

All cards:
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## 🔍 Verify Integration

### Check if payment was successful:

1. **MongoDB**: Check `payments` collection
   ```javascript
   db.payments.find().sort({createdAt: -1}).limit(1)
   ```

2. **User Status**: Check if `listed` field is `true`
   ```javascript
   db.users.findOne({_id: ObjectId("user_id")})
   ```

3. **Razorpay Dashboard**: Go to **Payments** tab to see transaction

### Check webhook is working:

1. Go to Razorpay Dashboard → **Settings** → **Webhooks**
2. Click on your webhook
3. Check **Recent Deliveries** tab
4. Status should be `200 OK`

## 🐛 Common Issues

### Issue 1: "Payment verification failed"
**Solution**: 
- Verify `RAZORPAY_KEY_SECRET` is correct in server `.env`
- Restart the server after changing `.env`

### Issue 2: Webhook not receiving events
**Solution**:
- For local testing, use ngrok: `ngrok http 5000`
- Update webhook URL in Razorpay dashboard with ngrok URL
- Ensure webhook is **Active** in dashboard

### Issue 3: "Razorpay is not defined"
**Solution**:
- Check internet connection (Razorpay script loads from CDN)
- Try refreshing the page
- Check browser console for script loading errors

### Issue 4: Payment successful but user not listed
**Solution**:
- Check server logs for errors
- Verify webhook received the event (Razorpay Dashboard → Webhooks)
- Manually check database: `db.users.updateOne({_id: ObjectId("user_id")}, {$set: {listed: true}})`

## 📱 Going to Production

When ready for production:

1. **Switch to Live Mode** in Razorpay Dashboard
2. Generate **Live API Keys** (Settings → API Keys)
3. Update `.env` files with live keys (remove `_test` from key IDs)
4. Update webhook URL to production domain
5. Test with real card (₹1 test transaction recommended)
6. Enable payment notifications in Razorpay Dashboard

## 🔐 Security Checklist

- [ ] Never commit `.env` files to git
- [ ] Use environment variables for all secrets
- [ ] Webhook URL is HTTPS (required for production)
- [ ] Server validates payment signatures
- [ ] API endpoints are authenticated
- [ ] Amount validation on server side

## 📞 Need Help?

- **Razorpay Docs**: https://razorpay.com/docs/
- **Razorpay Support**: support@razorpay.com
- **Integration Details**: See `RAZORPAY_INTEGRATION.md`

---

**🎉 That's it! Your Razorpay integration is ready to use.**
