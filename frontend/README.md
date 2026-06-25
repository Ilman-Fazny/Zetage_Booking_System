# 🚀 Zentage Talent Show - Seat Booking Portal (Frontend)

Welcome to the frontend application for the **Zentage Talent Show** booking ecosystem, proudly organized for the **Sasnaka Sansada Foundation**.

This portal provides a high-performance, cinematic dark-mode user experience that allows attendees to view live seating availability at the **Elphinstone Theatre (Maradana)**, securely select multiple seats via an interactive SVG matrix grid, complete registration details, clear gate payments, and instantly receive their entry pass tickets embedded with digital validation QR codes.

---

## 🛠️ Tech Stack & Key Features

* **Framework:** React 18+ powered by **Vite** (for ultra-fast Hot Module Replacement during development).
* **Styling & UI:** Tailwind CSS for a utility-first fluid design layout, coupled with **Framer Motion** for smooth micro-animations and page transitions.
* **Seat Map:** Custom, fully responsive SVG-based interactive seat map with smooth zooming, panning, and real-time selection capabilities.
* **Global State & Auth:** Custom JWT-based authentication system managed through `src/lib/auth.js` for secure session validation.
* **HTTP Client:** Axios (`src/lib/api.js`) with custom request interceptors to automatically attach JWT Bearer tokens behind the scenes.
* **Hardware Gate Controls:** Automated camera feed streaming using `html5-qrcode` to allow gate stewards to scan entry passes at the venue.

---

## 📂 Project Directory Structure

```text
frontend/
├── public/                  # Global static files (Favicon, logos)
├── src/
│   ├── assets/              # Locally bundled branding images and styles
│   ├── components/          # Reusable UI components
│   │   ├── seat-map/        # SVG-based interactive theatre map components
│   │   ├── QrScannerModal.jsx # Camera streaming and QR decoding module
│   │   └── ...
│   ├── lib/                 # Utilities and API configuration
│   │   ├── api.js           # Central Axios API client with interceptors
│   │   └── auth.js          # Authentication hooks and context
│   ├── pages/               # Application route views
│   │   ├── AdminDashboard.jsx  # Admin panel (Gate scanning, user management, resend emails)
│   │   ├── AdminLogin.jsx      # Secure gateway for admins
│   │   ├── SeatSelectionPage.jsx # Main interactive booking interface
│   │   ├── TicketPage.jsx      # Digital entry pass and QR code display
│   │   ├── ResetPassword.jsx   # Admin password reset flow
│   │   └── BookingCallback.jsx # Processing state after successful booking
│   ├── App.jsx              # Central router configuration hub
│   └── main.jsx             # Application initialization entryway
├── index.html               # Main single-page application document
├── vite.config.js           # Vite build configuration
└── package.json             # Core dependencies and scripts
```

---

## ⚙️ Quick Installation & Setup Guide

### 1. Prerequisites

Ensure you have **Node.js (v18 or higher)** installed on your machine.

### 2. Clone and Install Dependencies

Navigate into the `frontend` directory inside your terminal and run:

```bash
# Install core dependencies
npm install
```

### 3. Configure Environment Variables

Create a `.env` file directly in your frontend project root directory (next to `package.json`) to configure the backend API connection:

```env
VITE_API_URL=http://localhost:8000
```

### 4. Boot Up the Local Development Server

```bash
npm run dev
```

Open your browser and navigate to the local server URL provided in your terminal output (typically **`http://localhost:5173`**).

---

## 🔒 Security & API Integration Lifecycle

### Request Interceptor Hook

All outgoing secure network requests initiated via our core Axios instance (`src/lib/api.js`) pass through an automated pre-flight security layer. The interceptor retrieves the stored JWT from `localStorage` and automatically injects it into the headers:

```javascript
// Automatically injected into secure outbound transactions
config.headers.Authorization = `Bearer ${token}`;
```

### Gate Validation Protocol

To prevent ticket fraud, scanning a user's digital ticket with a standard smartphone camera will only show a plain reference string code. The official registration check-in sequence is securely executed via the `/api/admin/check-in/` backend endpoint, which is only accessible to authorized stewards scanning QR codes through the built-in **Admin Dashboard** (`/admin`).
