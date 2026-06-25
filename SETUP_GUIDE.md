# 🚀 Complete Setup & Testing Guide

## Step 1: Seed the Database with Test Data

Run this command in the server directory:

```bash
cd server
node seeddb.js
```

This will:

- Create 3 test users (customer, owner, admin)
- Create 3 test restaurants
- Create 6 food items
- Clear old data first

**Test Credentials:**

- **Customer:** sohom@example.com / password123
- **Admin:** admin@example.com / password123
- **Owner:** owner@example.com / password123

---

## Step 2: Start the Server

```bash
npm start
```

Server should run on: http://localhost:4000

---

## Step 3: Start the Client

In another terminal:

```bash
cd client
npm run dev
```

Client runs on: http://localhost:5173

---

## Step 4: Test the Complete Flow

### 🛒 Customer Flow (Order Food):

1. Open browser: http://localhost:5173
2. Click Account → Login
3. Enter: **sohom@example.com** / **password123**
4. See 3 restaurants (Sushi House, Burger Kingdom, Pizza Palace)
5. Click on a restaurant
6. Add items to cart (watch badge update)
7. Click Cart button
8. Enter delivery address
9. Click "PROCEED TO PAY"
10. ✅ Order placed!

### ✅ Admin Flow (Approve Orders):

1. Logout (click account → logout)
2. Click Account → Login
3. Enter: **admin@example.com** / **password123**
4. You'll see "Orders" page
5. View all pending orders
6. Click buttons to change status:
   - "Accept & Prepare" → Changes to Preparing
   - "Out for Delivery" → Changes to Out for delivery
   - "Mark Delivered" → Changes to Delivered
7. ✅ Orders are approved!

---

## What's Fixed:

✅ **Restaurants showing** - Database seeded with 3 restaurants  
✅ **Can add items** - Cart functionality working  
✅ **Can checkout** - Order placement working  
✅ **Admin can approve** - New Orders page for admin  
✅ **Complete flow** - From browse → order → admin approve

---

## Database Structure:

```
Users:
├─ Customer (sohom@example.com)
├─ Admin (admin@example.com)
└─ Owner (owner@example.com)

Restaurants:
├─ The Sushi House (6 items)
├─ Burger Kingdom (6 items)
└─ Pizza Palace (6 items)

Orders:
├─ User → Restaurants → Items
└─ Status: Pending → Preparing → Out for delivery → Delivered
```

---

## Troubleshooting:

**If restaurants don't show:**

- Make sure MongoDB is running
- Run `node seeddb.js` again
- Clear browser cache

**If orders don't work:**

- Check server console for errors
- Ensure user is logged in
- Verify token in localStorage

**If admin page is blank:**

- Login as admin first
- Check if orders exist in database
- Verify API returns data

---

Enjoy! 🎉
