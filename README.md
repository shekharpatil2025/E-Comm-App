# E-Commerce Web Application

A full-stack e-commerce platform built with **Spring Boot** and **React.js**, featuring JWT-based authentication, role-based access control, pagination, and a complete cart-to-order lifecycle.

---

## Tech Stack

**Backend** — Java 21 · Spring Boot · Spring Security 6.x · JWT (JJWT) · Hibernate/JPA · PostgreSQL · Maven

**Frontend** — React.js · Vite · Axios · React Router · Context API · Tailwind CSS

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
- **Soft delete** — products flagged inactive instead of hard-deleted, preserving order history and referential integrity

### Cart & Orders
- Add/remove items from cart (persisted in localStorage)
- Stock decrement on checkout with **optimistic locking** (`@Version`) to prevent overselling under concurrent requests
- Cart-to-Order lifecycle with order history

### API & Documentation
- RESTful API with layered architecture (Controller → Service → Repository)
- **Swagger/OpenAPI** interactive docs with JWT authorization support
- Centralised exception handling via `@ControllerAdvice`
- DTO-based request validation with `@Valid`

### Testing
- 32 unit tests across `ProductService`, `AuthService`, and `JwtUtil`
- Mockito mocks for all dependencies — no database required for tests
- Tests for negative cases — duplicate registration, bad credentials, expired tokens, tampered tokens

---

## Quick Start with Docker

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
| GET | `/api/products` | Public | Get all available products |
| GET | `/api/products/paged` | Public | Get products with pagination + filters |
| GET | `/api/product/{id}` | Public | Get product by ID |
| GET | `/api/product/{id}/image` | Public | Get product image |
| GET | `/api/products/search?keyword=` | Public | Search products |
| POST | `/api/product` | ADMIN | Create product with image |
| PUT | `/api/product/{id}` | ADMIN | Update product |
| DELETE | `/api/product/{id}` | ADMIN | Soft delete product |

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
| GET | `/api/orders` | USER / ADMIN | Get all orders |
| POST | `/api/order` | USER / ADMIN | Place order |

---

## Project Structure

```
E-Comm-App/
├── docker-compose.yml
├── SpringBoot-ecom/               # Spring Boot backend
│   ├── Dockerfile
│   └── src/
│       ├── main/java/
│       │   ├── controller/        # REST controllers
│       │   ├── service/           # Business logic
│       │   ├── repo/              # JPA repositories
│       │   ├── model/             # Entities + DTOs
│       │   ├── security/          # JWT filter, config
│       │   ├── config/            # Swagger config
│       │   └── exception/         # Global exception handler
│       └── test/java/
│           ├── service/           # ProductService + AuthService tests
│           └── security/          # JwtUtil tests
│
└── t-ecom/                        # React/Vite frontend
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── components/            # UI components
        ├── pages/                 # Auth pages
        ├── Context/               # Global state
        └── axios.jsx              # Axios with JWT interceptor
```

---

## Key Design Decisions

**Soft Delete over Hard Delete** — Deleting a product that has been ordered violates PostgreSQL FK constraints. Products are marked `productAvailable = false` with stock zeroed. Order history stays intact.

**Optimistic Locking** — `@Version` on Product entity prevents two simultaneous checkouts from overselling the same item.

**Stateless JWT Auth** — No server-side sessions. Role is baked into the JWT token at login time and read on every request by `JwtAuthFilter`.

**Two-layer Security** — Frontend route guards (`ProtectedRoute`, `AdminRoute`) provide UX protection. Backend Spring Security rules are the real enforcement.

**Multi-stage Docker Build** — Stage 1 uses Maven to build the jar. Stage 2 copies only the jar into a lightweight JRE Alpine image (~80MB vs ~500MB for full JDK).

**Docker Networking** — All containers share a bridge network. Spring Boot connects to PostgreSQL using the Docker service name (`db`) not `localhost`.

---

## Author

**Shekhar Patil** — Backend Developer

[LinkedIn](https://linkedin.com/in/shekhar-patil-634918236) · [GitHub](https://github.com/shekharpatil2025) · shekharpatil2025@gmail.com
