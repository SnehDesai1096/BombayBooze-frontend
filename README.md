# 🍸 BombayBooze - Premium Alcohol Delivery Web Application

BombayBooze is a modern, high-end, luxury alcohol delivery web application designed for fast, local delivery of fine wines, craft beers, single malts, and premium spirits. Built with React 19, Vite, and custom CSS design tokens, it offers a seamless experience across desktop and mobile devices, powered by a FastAPI backend API with MySQL.

---

## 🌟 Key Features

### 1. 🚀 Custom Theme-Adaptive Loading Screen
* **Brand Animation:** Features a smooth, shadowless bouncing BombayBooze logo with a capsule progress bar and staggered loading text animation (`Loading...`).
* **Route & Initial Trigger:** Automatically displays during initial page load and route transitions.
* **Theme Adaptable:** Seamlessly transitions between **Dark Luxury Gold**, **Light Mode**, and fallback themes based on active site settings.

### 2. 🔐 Locked Dark Luxury Login & Registration Page
* **Aesthetic Design:** Deep obsidian background (`#0a0a0a`) with an atmospheric ambient gold radial glow and animated floating gold ember blobs.
* **Authentication Modes:** Toggle between **Sign In** and **Create Account** modes.
* **FastAPI Backend Integration:** Connected to `/api/auth/signup` and `/api/auth/login` with JWT bearer token storage and `/api/auth/me` user profile sync.
* **Compliance Integration:** Mandatory 21+ age verification checkbox for account creation and date of birth validation.
* **Interactive UI:** Password visibility toggle (Show/Hide), error validation banners, password reset prompt, and guest browsing link (`Browse collection as guest →`).
* **Theme Locking:** Enforces the "Dark Luxury Gold" theme on the auth page regardless of the global light/dark toggle state.

### 3. 🍾 Revamped Storefront & Live Catalog (`Home.jsx`)
* **Top Promo Ribbon:** Slim announcement bar highlighting express 30-minute delivery in Mumbai, free shipping thresholds, and 21+ verification.
* **Panoramic Hero Carousel:** Multi-slide luxury promotional banner with auto-play, pause-on-hover, prev/next arrows, interactive pagination dots, and direct category jump actions.
* **Prestige Brand Partners Marquee:** Horizontal brand ticker featuring top distilleries (*The Macallan, Johnnie Walker, Glenfiddich, Grey Goose, Bombay Sapphire, Amrut, Jameson, Château Margaux, Hennessy*).
* **Live Catalog Toolbar:** Category title, real-time item count badge, instant search filtering (`q`), and an *"In-Stock Only"* toggle.
* **Dynamic Category Pills:** Horizontal scrollable pills with real-time product count badges fetched live from `GET /api/categories`.
* **FastAPI Catalog Endpoints:**
  - `GET /api/categories`: Fetches all active categories with product counts.
  - `GET /api/categories/{category_id}/products`: Fetches products filtered by category.
  - `GET /api/products`: Full catalog search and filtering.
* **Smart Image Resolution & Fallback:** Direct rendering of real product images (`/static/products/...`) with automatic fallback to `/placeholder/image-unavailable.svg` whenever an image is missing or fails to load.

### 4. 🥃 Enhanced Product Cards (`ProductCard.jsx`)
* **Rich Metadata:** Displays drink thumbnail, brand name, category badge, ABV % badge, volume in ml, formatted price in ₹ (INR), and stock availability.
* **Out-of-Stock Overlay:** Clear visual indication for depleted stock with disabled actions.
* **Micro-interactions:** Interactive animated "Add to Cart" button with temporary checkmark confirmation.

### 5. 🌓 Dynamic Light & Dark Mode Toggle
* **Persistent Theme State:** Built-in `ThemeContext` backed by `localStorage` (`bb_theme`) and HTML `data-theme` attribute.
* **Toggle Switch:** Animated custom pill toggle switch with Sun and Moon icons located in the top navigation bar.
* **Global CSS Variables:** Full color palette adaptation across background surfaces, text hierarchy, borders, input fields, cards, and buttons.

### 6. 🧭 Fully Responsive Navigation & Mobile Menu Drawer
* **Top Navigation Bar:** Sticky top glassmorphism bar featuring the BombayBooze brand logo, live delivery location indicator (`Deliver to Mumbai`), cart count badge, and theme toggle.
* **Mobile Drawer Menu:** On screens under 768px, navigation collapses into a mobile hamburger drawer with slide-down animations and scroll locking.

### 7. 🛒 Checkout & Age Compliance (`Checkout.jsx`)
* **Cart Management:** Live item list with quantity increment/decrement controls, item removal, and empty cart state.
* **Age & Permit Declarations:** Mandatory compliance checkboxes requiring user confirmation of 21+ legal drinking age and local permit possession.
* **Order Summary:** Automatic calculations for subtotal, delivery fee (₹415.00), taxes/fees (8%), and grand total.
* **Order Confirmation:** Interactive confirmation screen reminding customers to prepare a valid physical government ID upon delivery.

---

## 📁 Project Directory Structure

```text
AlcoholDelivery_Customer/
├── public/
│   ├── favicon.svg             # Application Favicon
│   ├── logo.png                # Brand Logo Image
│   ├── image-unavailable.svg   # Root Placeholder Image
│   ├── placeholder/
│   │   └── image-unavailable.svg # Placeholder SVG Asset
│   ├── static/
│   │   ├── placeholder/        # Mirrored Static Placeholders
│   │   └── products/           # Product Image Assets (.jpg)
│   └── images/                 # Theme Backgrounds & Mock Imagery
├── src/
│   ├── assets/                 # SVGs and Icons
│   ├── components/             # Reusable UI Components
│   │   ├── AuthModal.jsx       # Modal for Age Gate & Quick Phone OTP
│   │   ├── LoadingScreen.jsx   # Dynamic Loading Screen & Route Transitions
│   │   ├── Navbar.jsx          # Responsive Navigation Bar & Mobile Drawer
│   │   ├── ProductCard.jsx     # Drink Product Card Component
│   │   └── ThemeToggle.jsx     # Dark/Light Mode Switch Toggle
│   ├── context/                # Global Application Contexts
│   │   ├── AppProvider.jsx     # Cart, Auth, and Application State
│   │   ├── LoadingContext.jsx  # Loading Trigger & State Management
│   │   └── ThemeContext.jsx    # Light / Dark Theme Provider
│   ├── data/
│   │   └── mockData.js         # Fallback Mock Catalog & Categories
│   ├── pages/                  # Page Components
│   │   ├── Checkout.jsx        # Cart & Order Checkout Page
│   │   ├── Home.jsx            # Store Front & Live Catalog Page
│   │   ├── Login.jsx           # Dark Luxury Login Page
│   │   └── Signup.jsx          # User Registration Page
│   ├── services/               # API Integration Services
│   │   ├── authService.js      # Backend Auth Service (Signup, Login, Me)
│   │   └── catalogService.js   # Backend Catalog Service (Categories & Products)
│   ├── styles/                 # Consolidated CSS Stylesheets
│   │   ├── App.css             # Supplementary Styles
│   │   ├── index.css           # Global Theme Tokens & Base Component CSS
│   │   ├── LoadingScreen.css   # Loading Overlay & Animation Styles
│   │   └── Login.css           # Dark Luxury Auth Page Stylesheet
│   ├── App.jsx                 # Main Application Layout & Routing
│   └── main.jsx                # React Entry Point & Context Wrapping
├── .env                        # Local Environment Configuration
├── .env.example                # Example Environment Variables
├── .gitignore                  # Git Ignore Rules
├── index.html                  # HTML5 Template
├── package.json                # Dependencies & Scripts
└── vite.config.js              # Vite Bundler & Proxy Configuration
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root of `AlcoholDelivery_Customer/` (or copy from `.env.example`):

```bash
# Point to your local FastAPI backend instance
VITE_API_BASE_URL=http://localhost:8000
```

> **Note on Vite Proxy:** The development server in `vite.config.js` is pre-configured to proxy `/api` and `/static` requests directly to `http://localhost:8000`, ensuring cross-origin requests work smoothly without CORS restrictions.

---

## 🚀 How to Run and Develop

### Prerequisites
* **Node.js** (v18.0.0 or higher recommended)
* **npm** (v9.0.0 or higher)
* **BombayBooze API Backend** running on `http://localhost:8000`

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
Run the local Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Build for Production
To bundle and optimize the application for production deployment:
```bash
npm run build
```
The output files will be generated inside the `dist/` folder.

### 4. Preview Production Build
To test the production build locally:
```bash
npm run preview
```

### 5. Code Linting
Run ESLint to check for code quality and syntax errors:
```bash
npm run lint
```

---

## 🛠️ Tech Stack & Dependencies

* **Frontend Framework:** [React 19](https://react.dev/)
* **Build Tool & Dev Server:** [Vite 8](https://vitejs.dev/)
* **Routing:** [React Router v7](https://reactrouter.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Typography:** [Google Fonts (Outfit)](https://fonts.google.com/specimen/Outfit)
* **Styling:** Custom Vanilla CSS with CSS Custom Properties / Design Tokens
* **Backend API:** FastAPI with MySQL (BombayBooze API)
