# Talent Show Booking System Backend

An industry-standard, high-performance REST API built with FastAPI and PostgreSQL designed to manage event reservations, venue ticketing, and concurrent seat allocations for talent show productions.

## 🚀 Architecture Overview

This project is built using a **Layered Architecture (Separation of Concerns)** pattern to ensure scalability, clean testing boundaries, and maintainable business logic:

*   **Routing Layer (`app/api/`)**: Handles incoming HTTP requests, route parameters, and status codes.
*   **Validation Layer (`app/schemas/`)**: Powered by Pydantic to strictly validate data shapes entering and leaving the system.
*   **Business Logic Layer (`app/services/`)**: The core engine containing orchestration logic, workflows, and rules.
*   **Data Access Layer (`app/models/`)**: Managed by SQLAlchemy ORM to map Python object states to PostgreSQL relational tables.

---

## 🛠️ Tech Stack & Tools

*   **Framework:** FastAPI (Asynchronous Python Web Framework)
*   **Database:** PostgreSQL (Relational Database)
*   **ORM:** SQLAlchemy 2.0 (Object Relational Mapper)
*   **Database Migrations:** Alembic
*   **Authentication:** JWT (JSON Web Tokens) with Passlib & Bcrypt hashing
*   **Environment Management:** Pydantic Settings (Type-safe configuration tracking)
