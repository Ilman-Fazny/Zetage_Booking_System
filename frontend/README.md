# 🚀 Zentage Talent Show - Seat Booking Portal

Welcome to the frontend application for the **Zentage Talent Show** booking ecosystem, proudly organized for the **Sasnaka Sansada Foundation**.

This portal provides a high-performance, cinematic dark-mode user experience that allows attendees to view live seating availability at the **Elphinstone Theatre (Maradana)**, securely select multiple seats via an interactive SVG matrix grid, complete registration details, clear gate payments, and instantly receive their entry pass tickets embedded with digital validation QR codes.

---

## 🛠️ Tech Stack & Key Features

* **Framework:** React 18+ powered by **Vite** (for ultra-fast Hot Module Replacement during development).
* **Styling & UI:** Tailwind CSS for a utility-first fluid design layout and glassmorphism components.
* **Global State & Auth:** React Context API (`AuthContext`) managing user profiles and secure session validation.
* **HTTP Client:** Axios with custom request interceptors to automatically attach Postman-style JWT Bearer tokens behind the scenes.
* **Hardware Gate Controls:** Automated camera feed streaming using `html5-qrcode` to allow gate stewards to scan passes.

---

## 📂 Project Directory Structure

```text
zentage-frontend/
├── public/                  # Global static files (Favicon, logos)
├── src/
│   ├── assets/              # Locally bundled branding images and styles
│   ├── components/          # Reusable UI Lego bricks (Buttons, Layouts, Logo)
│   ├── context/             # Global AuthContext provider state controls
│   ├── lib/                 # Central Axios API client & request configurations
│   ├── pages/               # High-level route screen views
│   │   ├── Login.jsx        # Google OAuth & email credential validation
│   │   ├── SeatingMap.jsx   # Interactive structural theatre grid mapping
│   │   ├── Checkout.jsx     # Personal details & payment handling
│   │   ├── TicketPass.jsx   # QR code generation container
│   │   └── AdminScanner.jsx # Gate control camera streaming module
│   ├── App.jsx              # Central router configuration hub
│   └── main.jsx             # Application initialization entryway
├── .env.example             # Template for configuration environment variables
├── index.html               # Main single-page application document
└── package.json             # Core dependency manifest scripts

```

---

## ⚙️ Quick Installation & Setup Guide

### 1. Prerequisites

Ensure you have **Node.js (v18 or higher)** installed on your machine.

### 2. Clone and Install Dependencies

Navigate into your frontend directory path inside your terminal and run:

```bash
# Install core dependencies
npm install

```

### 3. Configure Environment Variables

Create a `.env` file directly in your frontend project root directory (next to `index.html`) and supply your FastAPI endpoint location:

```env
VITE_API_URL=http://127.0.0.1:8000

```

### 4. Boot Up the Local Development Server

```bash
npm run dev

```

Open your browser and navigate to the local server URL provided in your terminal output (typically **`http://localhost:5173`**).

---

## 🔒 Security & API Integration Lifecycle

### Request Interceptor Hook

All outgoing network requests initiated via our core Axios instance (`src/lib/api.js`) pass through an automated pre-flight security layer. If a user session token is present in memory, the guard automatically writes the authorization token directly onto the headers:

```javascript
// Automatically injected into every secure outbound transaction
config.headers.Authorization = `Bearer ${authToken}`;

```

### Gate Validation Protocol

To prevent ticketing bypass fraud, scanning a ticket with a standard smartphone camera will show a plain reference string code. The registration check-in sequence is structurally locked behind the `/api/admin/check-in/` gateway endpoint inside the FastAPI engine, which only grants access to verified tokens processed through the built-in Admin sub-dashboard.
