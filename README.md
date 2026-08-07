# E-Commerce Web Application

A production-grade full-stack e-commerce platform built with **Spring Boot** and **React.js**, featuring JWT authentication, role-based access control, Redis caching, pagination, order status state machine, and full Docker deployment.

---

## Tech Stack

**Backend** — Java 21 · Spring Boot · Spring Security 6.x · JWT (JJWT) · Hibernate/JPA · PostgreSQL · Redis · Maven

**Frontend** — React.js · Vite · Axios · React Router · Context API

**DevOps** — Docker · Docker Compose · Nginx · Multi-stage builds

**Testing** — JUnit 5 · Mockito · 32 unit tests

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
- Full CRUD for products with image upload (ADMIN only)
- **Pagination** — configurable page size, page navigation
- **Filtering** — by category and price range
- **Sorting** — by price, name, or ID (ascending/descending)
- Keyword search across name, description, brand, category
- **Soft delete** — products flagged inactive instead of hard-deleted, preserving order history and referential integrity against PostgreSQL FK constraints

### Performance
- **Redis caching** on product listings via `@Cacheable`
- **Cache eviction** via `@CacheEvict` on product update/delete — ensures cache never serves stale data
- 10-minute TTL with automatic cache refresh
- Response time drops from ~340ms (DB hit) to ~10ms (cache hit)

### Cart & Orders
- Add/remove items from cart (persisted in localStorage)
- Stock decrement on checkout with **optimistic locking** (`@Version`) to prevent overselling under concurrent requests
- **Order status state machine** — `PLACED → CONFIRMED → SHIPPED → DELIVERED / CANCELLED`
- Invalid transitions rejected with clear error message (e.g. `Cannot transition from DELIVERED to CANCELLED`)
- Terminal states (DELIVERED, CANCELLED) are immutable
- User-specific order history — USERs see only their own orders, ADMINs see all
- ADMIN can update order status via dropdown in the UI

### API & Documentation
- RESTful API with layered architecture (Controller → Service → Repository)
- **Swagger/OpenAPI** interactive docs with JWT authorization support at `/swagger-ui/index.html`
- Centralised exception handling via `@ControllerAdvice` returning consistent JSON error responses
- DTO-based request validation with `@Valid`

### Testing
- 32 unit tests across `ProductService`, `AuthService`, and `JwtUtil`
- Mockito mocks for all dependencies — no database required for tests
- Tests cover negative cases — duplicate registration, bad credentials, expired tokens, tampered tokens, soft delete never calls `deleteById`

---

## Quick Start with Docker 🐳

The easiest way to run the project — no manual setup needed.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Run
```bash
git clone https://github.com/shekharpatil2025/E-Comm-App.git
cd E-Comm-App
docker-compose up --build
```

First run takes 3-5 minutes to build images. After that:

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Swagger Docs | http://localhost:8080/swagger-ui/index.html |
| PostgreSQL | localhost:5433 |
| Redis | localhost:6379 |

### Stop
```bash
docker-compose stop      # stops containers, data is preserved
docker-compose down      # removes containers, data is preserved
docker-compose down -v   # removes everything including data
```

---

## Manual Setup (without Docker)

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL
- Redis
- Maven

### Backend Setup

```bash
git clone https://github.com/shekharpatil2025/E-Comm-App.git
cd E-Comm-App/SpringBoot-ecom
```

Create `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ecom_db
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=your-secret-key-minimum-32-characters-long
jwt.expiration-ms=86400000

spring.data.redis.host=localhost
spring.data.redis.port=6379
spring.cache.type=redis
spring.cache.redis.time-to-live=600000

spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

```bash
mvn spring-boot:run
```

### Frontend Setup

```bash
cd E-Comm-App/t-ecom
npm install
npm run dev
```

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user (role: USER) |
| POST | `/api/auth/login` | Public | Login, returns JWT token |

### Products
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/products` | Public | Get all available products (cached) |
| GET | `/api/products/paged` | Public | Get products with pagination + filters |
| GET | `/api/product/{id}` | Public | Get product by ID |
| GET | `/api/product/{id}/image` | Public | Get product image |
| GET | `/api/products/search?keyword=` | Public | Search products |
| POST | `/api/product` | ADMIN | Create product with image |
| PUT | `/api/product/{id}` | ADMIN | Update product (evicts cache) |
| DELETE | `/api/product/{id}` | ADMIN | Soft delete product (evicts cache) |

### Pagination & Filtering
```
GET /api/products/paged?page=0&size=8&sortBy=price&direction=asc&category=Laptop&minPrice=50000&maxPrice=150000
```

| Parameter | Default | Description |
|---|---|---|
| `page` | 0 | Page number (0-based) |
| `size` | 10 | Products per page |
| `sortBy` | id | Field to sort by (id, price, name) |
| `direction` | asc | Sort direction (asc, desc) |
| `category` | - | Filter by category |
| `minPrice` | - | Minimum price filter |
| `maxPrice` | - | Maximum price filter |

### Orders
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/orders/place` | USER / ADMIN | Place a new order |
| GET | `/api/orders` | ADMIN | Get all orders |
| GET | `/api/orders/my` | USER | Get logged-in user's orders only |
| PUT | `/api/orders/{orderId}/status` | ADMIN | Update order status |

### Order Status Transitions
```
PLACED → CONFIRMED → SHIPPED → DELIVERED
PLACED → CANCELLED
CONFIRMED → CANCELLED
```

---

## Project Structure

```
E-Comm-App/
├── docker-compose.yml
├── SpringBoot-ecom/                    # Spring Boot backend
│   ├── Dockerfile
│   └── src/
│       ├── main/java/
│       │   ├── controller/             # REST controllers
│       │   ├── service/               # Business logic + caching
│       │   ├── repo/                  # JPA repositories
│       │   ├── model/                 # Entities + DTOs + Enums
│       │   ├── security/              # JWT filter, config, util
│       │   ├── config/                # Swagger config
│       │   └── exception/             # Global exception handler
│       └── test/java/
│           ├── service/               # ProductService + AuthService tests
│           └── security/              # JwtUtil tests
│
└── t-ecom/                            # React/Vite frontend
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── components/                # UI components
        ├── pages/                     # Auth, Cart, Orders pages
        ├── Context/                   # Global auth + cart state
        └── axios.jsx                  # Axios with JWT interceptor
```

---

## Key Design Decisions

**Soft Delete over Hard Delete** — Deleting a product that has been ordered violates PostgreSQL FK constraints (`order_item` references `product`). Products are marked `productAvailable = false` with stock zeroed. Order history stays intact; the product disappears from the storefront.

**Optimistic Locking** — `@Version` on Product entity prevents two simultaneous checkout requests from overselling the same item. The second transaction sees a version mismatch and fails cleanly.

**Stateless JWT Auth** — No server-side sessions. Role is baked into the JWT token at login time and read on every request by `JwtAuthFilter`. Role changes require re-login since the old token still carries the previous role.

**Order Status State Machine** — Each status defines its allowed next states. Invalid transitions (e.g. `DELIVERED → PLACED`) throw `IllegalArgumentException` with a clear message. Terminal states (DELIVERED, CANCELLED) have empty transition sets and cannot be changed.

**Redis Cache Invalidation** — `@Cacheable` on `getAllProducts()` serves repeated requests from Redis. `@CacheEvict(allEntries = true)` on update and delete ensures the cache is cleared when data changes, preventing stale reads.

**Two-layer Security** — Frontend route guards (`ProtectedRoute`, `AdminRoute`) provide UX protection. Backend Spring Security rules are the real enforcement — frontend guards are convenience only.

**Multi-stage Docker Build** — Stage 1 uses Maven to build the jar. Stage 2 copies only the jar into a lightweight JRE Alpine image (~80MB vs ~500MB for full JDK).

**User-specific Orders** — When placing an order, the logged-in username (from `SecurityContextHolder`) is saved on the order. `GET /api/orders/my` filters by username so users only see their own orders. Admins use `GET /api/orders` to see everything.

---

## Author

**Shekhar Patil** — Backend Developer · Incoming @ HotelKey India (Oct 2026)

[LinkedIn](https://linkedin.com/in/shekhar-patil-634918236) · [GitHub](https://github.com/shekharpatil2025) · shekharpatil2025@gmail.com
