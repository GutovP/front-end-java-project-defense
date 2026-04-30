# Online Shop Frontend – Angular 19

A responsive and modular Angular 19+ frontend for the Online Shop project.
It integrates seamlessly with the Spring Boot backend, providing a clean UI, JWT‑secured user flows
and an admin interface for managing products and users.

## Features

### Authentication & Authorization

- Login, register, logout.
- JWT authentication with automatic token injection
- Role‑based UI (User / Admin)
- Route guards (AuthGuard, AdminGuard)
- Persistent login using localStorage

### Shop Functionality

- Product listing with responsive grid
- Product detail view
- Add to basket
- Basket page with quantity updates & total calculation
- User profile editing
- Admin dashboard for managing:
  •	Products
  •	Users
  •	Inventory

### Architecture & State

- Feature‑based module structure
- Shared components & services
- BehaviorSubject‑based state management (lightweight alternative to NgRx)
- Interceptors for JWT handling
- Reusable UI components (navbar, product card, alerts, loaders)
- Custom validators & resolvers

### UI & Styling

- Bootstrap 5
- Custom CSS for layout and components
- Mobile‑friendly responsive design
- Toast notifications for success/error/info message

### Tech Stack

- Framework: Angular 19+
- Styling: Bootstrap 5, Custom CSS
- State: BehaviorSubject
- API: REST communication with Spring Boot backend
- Auth: JWT + HttpInterceptor
- Build: Angular CLI

### Backend Integration

The frontend communicates with the Spring Boot backend via REST API:
- Auth endpoints
- Product endpoints
- Basket endpoints
- User profile endpoints
- Admin endpoints
All requests automatically include the JWT token via an HttpInterceptor.


## Project Structure
```
src/
├── app
│   ├── admin
│   │   └── users-list                 # Admin users management
│   │
│   ├── core
│   │   ├── header                 # Header component
│   │   ├── models                 # Interfaces (User, Product, Basket, Toast)
│   │   └── toast                  # Toast service + component
│   │
│   ├── home                       # Home page module
│   │
│   ├── product
│   │   ├── add-new                # Add new product page
│   │   ├── category-details       # Category details page
│   │   ├── product-details        # Product details page
│   │   ├── product.routes.ts
│   │   ├── product.service.ts
│   │
│   ├── shared
│   │   ├── guards                 # AuthGuard, AdminGuard
│   │   ├── interceptors           # JWT interceptor
│   │   ├── resolver               # Category resolver
│   │   └── validators             # Email + password validators
│   │
│   ├── user
│   │   ├── login                  # Login page
│   │   ├── logout                 # Logout logic
│   │   ├── profile                # Profile editing
│   │   ├── register               # Registration page
│   │   ├── user-routing.module.ts
│   │   ├── user.module.ts
│   │   ├── user.service.ts
│   │
│   ├── app.component.*            # Root component
│   ├── app.config.ts
│   └── app.routes.ts
│
├── assets                         # Images, icons, static files
├── environments                   # Environment configs
│   ├── environment.ts
│   └── environment.development.ts
│
├── index.html
├── main.ts
└── styles.css
```

## Future Improvements

- Checkout & payment integration
- Product search & filtering
- Admin analytics dashboard


