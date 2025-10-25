# 🔧 Pricing Not Updating - Troubleshooting Guide

## 🎯 Issue Analysis
The pricing is not updating in service forms even though the backend APIs are working.

## 🔍 Debugging Steps Added

### 1. **Enhanced Logging**
- Added console logs to track API calls and responses
- Forms now log pricing data on component mount
- Better error messages for failed API calls

### 2. **API Testing Component**
- Created `PricingDebug.jsx` component for testing
- Can test API calls directly from frontend
- Shows exact API responses and errors

### 3. **Potential Issues to Check**

#### A. Server Connection
```bash
# Check if server is running
curl http://localhost:8000/api/pricing

# Check specific service
curl http://localhost:8000/api/pricing/gst/filing
```

#### B. CORS Issues
- Frontend might be on different port than backend
- Check if VITE_API_URL is set correctly
- Verify axios baseURL configuration

#### C. Database Issues
- MongoDB might not be connected
- ServicePricing collection might be empty
- Admin pricing initialization might have failed

## 🧪 Test Instructions

### 1. **Open Browser Console**
When you load a service form, you should see:
```
useServicePrice: Fetching gst/filing
Fetching price for gst/filing
API response: {...}
useServicePrice: Got price 1999 for gst/filing
GSTFilingForm pricing: {price: 1999, priceLoading: false, formattedPrice: "₹1,999"}
```

### 2. **Check Network Tab**
- Should see requests to `/api/pricing/gst/filing`
- Response should be 200 OK with price data
- If 404/500, server routing issue
- If no request, frontend issue

### 3. **Test API Directly**
Add this to any component to test:
```javascript
useEffect(() => {
  axios.get('/api/pricing/gst/filing')
    .then(res => console.log('Direct test:', res.data))
    .catch(err => console.error('Direct error:', err));
}, []);
```

## 🚀 Quick Fixes to Try

### Fix 1: Server Environment
```bash
# Make sure server is running on correct port
cd server
npm start
# Should show: 🚀 Server running on port 8000
```

### Fix 2: Initialize Pricing
```bash
curl -X POST http://localhost:8000/api/pricing/initialize
```

### Fix 3: Check Database
```bash
# In MongoDB or admin panel
db.servicepricings.find({})
# Should return pricing documents
```

### Fix 4: Force Refresh
Add refresh button to forms for manual testing:
```javascript
<button onClick={() => window.location.reload()}>
  Refresh Pricing
</button>
```

## 📋 Expected Behavior
1. Form loads → API call to `/api/pricing/gst/filing`
2. API returns: `{success: true, data: {price: 1999}}`
3. Form displays: "₹1,999"
4. Admin changes price → Event triggers → Form refreshes → New price shown

Check browser console and network tab to see where the flow breaks!