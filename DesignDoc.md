# Alcohol Delivery Customer Web App (React/Vue)

## 1. Objective
Build a web-based customer application for alcohol delivery that is:
- Compliance-aware (age + permit declaration)
- Fast and intuitive
- Scalable for multiple vendors

---

## 2. Core Features

### 2.1 User Authentication
- Sign up / Login (Email, Phone OTP)
- Session management (JWT / cookies)
- Age gate on first login (DOB input)

### 2.2 Location Management
- Detect user location (GPS / manual input)
- Save multiple addresses
- Serviceability check (based on delivery zones)

### 2.3 Store Discovery
- List nearby licensed stores
- Filters:
  - Distance
  - Ratings
  - Delivery time
- Store detail page:
  - Name
  - License info (optional display)
  - Delivery ETA

### 2.4 Product Browsing
- Categories (Beer, Wine, Whisky, etc.)
- Search functionality
- Product cards:
  - Name
  - Price
  - Volume

### 2.5 Cart & Checkout
- Add/remove items
- Price breakdown
- Delivery fee calculation

#### Compliance Layer (Important)
- Age confirmation checkbox
- Permit declaration checkbox
- Terms acceptance

### 2.6 Payment Integration
- Online payments (UPI, Cards)
- Cash on delivery (optional)

### 2.7 Order Tracking
- Real-time order status:
  - Placed
  - Accepted
  - Out for delivery
  - Delivered
- Map tracking (optional MVP skip)

### 2.8 Order History
- List of past orders
- Reorder option

### 2.9 Notifications
- Order updates (email/SMS/push)

---

## 3. UX Considerations

### 3.1 Age Gate (First Screen)
- Block access until DOB entered
- Store verification flag in backend

### 3.2 Compliance UX
- Keep it low friction:
  - Checkbox instead of document upload
  - Clear messaging

### 3.3 Mobile-first Design
- Most users will order via mobile browser
- Use responsive layouts

---

## 4. Tech Stack Options

### Option A: React
- React + Next.js
- Tailwind CSS
- Axios / React Query

### Option B: Vue
- Vue 3 + Vite
- Pinia (state management)
- Axios

---

## 5. Frontend Architecture

### 5.1 Folder Structure (React Example)

src/
  components/
  pages/
  services/
  hooks/
  store/
  utils/

### 5.2 Key Modules
- Auth Module
- Store Module
- Product Module
- Cart Module
- Order Module

---

## 6. API Integration (High-Level)

### Auth APIs
- POST /login
- POST /signup

### Store APIs
- GET /stores
- GET /stores/:id

### Product APIs
- GET /products?storeId=

### Cart APIs
- POST /cart
- GET /cart

### Order APIs
- POST /order
- GET /orders

---

## 7. Step-by-Step Development Plan

### Step 1: Project Setup
- Initialize React/Vue app
- Setup routing
- Setup basic UI framework

### Step 2: Authentication
- Build login/signup
- Add age gate

### Step 3: Store Listing
- Fetch and display stores
- Add filters

### Step 4: Product Listing
- Display products by store
- Add search

### Step 5: Cart System
- Add to cart functionality
- Persist cart (local storage)

### Step 6: Checkout Flow
- Address selection
- Compliance checkboxes
- Payment integration

### Step 7: Order Tracking
- Order confirmation page
- Status updates

### Step 8: Optimization
- Lazy loading
- API caching
- Error handling

---

## 8. MVP Scope (Recommended)

Include:
- Authentication
- Store browsing
- Product listing
- Cart + checkout
- Compliance checkbox

Exclude (initially):
- Live tracking
- Advanced recommendations

---

## 9. Future Enhancements

- AI-based product recommendations
- Dynamic pricing
- Subscription models
- Loyalty programs

---

## 10. Key Risks

- Compliance violations
- Poor UX due to restrictions
- Vendor inventory sync issues

---

## 11. Conclusion

Focus on:
- Clean UX
- Strong compliance layer
- Fast checkout experience

Build MVP quickly, validate with few vendors, then scale.

