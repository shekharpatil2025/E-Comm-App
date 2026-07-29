# E-Commerce Web Application

A full-stack e-commerce platform built with **Spring Boot** and **React.js**, featuring JWT-based authentication, role-based access control, and a complete cart-to-order lifecycle.

---

## Tech Stack

**Backend** — Java 21 · Spring Boot · Spring Security 6.x · JWT (JJWT) · Hibernate/JPA · PostgreSQL · Maven

**Frontend** — React.js · Vite · Axios · React Router · Context API · Tailwind CSS

---

## Features

### Security
- JWT authentication with stateless session management
- Role-based access control — `ADMIN` and `USER` roles
- Spring Security 6.x filter chain with custom `JwtAuthFilter`
- BCrypt password hashing
- CORS configuration for React frontend integration
- Axios interceptors auto-attach Bearer tokens and handle 401 redirects

### Product Management
- Full CRUD for products (Admin only)
- Image upload and retrieval
- Category-based filtering and keyword search
- **Soft delete** — products flagged inactive instead of hard-deleted, preserving order history and referential integrity against PostgreSQL FK constraints

### Cart & Orders
- Add/remove items from cart
- Stock decrement on checkout with **optimistic locking** (`@Version`) to prevent overselling under concurrent requests
- Cart-to-Order lifecycle with order history per user

### API Design
- RESTful API with layered architecture (Controller → Service → Repository)
- Centralised exception handling via `@ControllerAdvice` returning consistent JSON error responses
- DTO-based request validation with `@Valid`

---

## Project Structure

```
E-Comm-App/
├── SpringBoot-ecom/          # Spring Boot backend
│   └── src/main/java/
│       ├── controller/       # REST controllers
│       ├── service/          # Business logic
│       ├── repo/             # JPA repositories
│       ├── model/            # Entities + DTOs
│       ├── security/         # JWT filter, config, user details
│       └── exception/        # Global exception handler
│
└── t-ecom/                   # React/Vite frontend
    └── src/
        ├── components/       # Navbar, Product, Cart, Orders etc.
        ├── pages/            # Auth pages (Login, Register)
        ├── Context/          # Global auth + cart state
        └── axios.jsx         # Axios instance with JWT interceptor
```

---

## Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL
- Maven

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/shekharpatil2025/E-Comm-App.git
cd E-Comm-App/SpringBoot-ecom
```

2. Create a PostgreSQL database
```sql
CREATE DATABASE ecom_db;
```

3. Create `src/main/resources/application.properties` (see template below)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ecom_db
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=your-secret-key-minimum-32-characters-long
jwt.expiration-ms=86400000

spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

4. Run the backend
```bash
mvn spring-boot:run
```
Backend starts at `http://localhost:8080`

### Frontend Setup

```bash
cd E-Comm-App/t-ecom
npm install
npm run dev
```
Frontend starts at `http://localhost:5173`

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | Get all available products |
| GET | `/api/product/{id}` | Public | Get product by ID |
| GET | `/api/product/{id}/image` | Public | Get product image |
| GET | `/api/products/search?keyword=` | Public | Search products |
| POST | `/api/product` | ADMIN | Create product |
| PUT | `/api/product/{id}` | ADMIN | Update product |
| DELETE | `/api/product/{id}` | ADMIN | Soft delete product |

### Orders
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/orders` | USER / ADMIN | Get all orders |
| POST | `/api/order` | USER / ADMIN | Place order |

---

## Key Design Decisions

**Soft Delete over Hard Delete** — Deleting a product that has been ordered violates PostgreSQL FK constraints (`order_item` references `product`). Instead of cascading deletes that destroy order history, products are marked `productAvailable = false` with stock zeroed. Order history stays intact; the product disappears from the storefront.

**Optimistic Locking** — The `Product` entity uses `@Version` to prevent two simultaneous checkout requests from overselling the same item. The second transaction sees a version mismatch and fails cleanly.

**Stateless JWT Auth** — No server-side sessions. The JWT token carries the user identity and role, verified on every request by `JwtAuthFilter`. Role changes require re-login to take effect (new token issued).

**Role-based Route Protection** — Frontend uses `ProtectedRoute` (requires login) and `AdminRoute` (requires ADMIN role) components. Backend enforces the same rules independently via Spring Security — frontend guards are UX convenience, backend rules are the real security.

---

## Screenshots

> Coming soon

---

## Author

**Shekhar Patil** — Java Backend Developer

[LinkedIn](https://linkedin.com/in/shekhar-patil-634918236) · [GitHub](https://github.com/shekharpatil2025) · shekharpatil2025@gmail.com
