# Zentage Talent Show Booking System

An enterprise-grade, full-stack ticketing and seat reservation ecosystem designed for high-demand talent show productions. The system features a modern, responsive user interface backed by a highly concurrent, asynchronous REST API with database-level row-locking to ensure flawless transaction handling during peak traffic.

---

## 🌐 System Architecture & Data Flow

The ecosystem is decoupled into two autonomous, single-responsibility layers communicating securely via an asynchronous RESTful API:

```text
  [ React Frontend ]  ---( HTTPS + JWT Auth )--->  [ FastAPI Backend Router ]
          │                                                    │
   (Memory Auth State)                                 (Dependency Injection)
          ▼                                                    ▼
   [ Tailwind UI ]                                 [ Business Logic Services ]
                                                               │
                                                     (SELECT FOR UPDATE Lock)
                                                               ▼
                                                    [ PostgreSQL Database ]
