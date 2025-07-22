# Shop Management System

## Overview

This is a full-stack shop management application built to handle multiple types of shops (dairy, meat, grocery) with role-based access control. The system provides comprehensive dashboards for administrators and shopkeepers to manage their respective operations including inventory, orders, and sales tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Custom component library built on Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with shadcn/ui component system using CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication with role-based access control
- **Session Management**: Express sessions with PostgreSQL store

### Build System
- **Frontend Bundler**: Vite with React plugin
- **Backend Bundler**: esbuild for production builds
- **Development**: tsx for TypeScript execution in development
- **Deployment**: Production build creates optimized static assets and bundled server

## Key Components

### Authentication System
- JWT token-based authentication
- Role-based access control (Admin vs Shopkeeper)
- Protected routes with automatic redirection
- Token validation middleware on API endpoints

### Database Schema
- **Users**: Stores admin and shopkeeper accounts with role information
- **Shops**: Manages different shop types (dairy, meat, grocery) with owner relationships
- **Categories**: Product categories specific to shop types
- **Products**: Inventory items with stock tracking and shop associations
- **Orders**: Order management with line items and status tracking

### API Structure
- RESTful API design with Express.js routes
- Centralized error handling middleware
- Request/response logging for API endpoints
- Authentication middleware for protected routes
- Role-based authorization middleware

### Role-Based Dashboards
- **Admin Dashboard**: Overview of all shops, products, orders, and system-wide analytics
- **Shopkeeper Dashboard**: Shop-specific metrics, inventory management, and order tracking
- **Responsive Design**: Mobile-friendly interface with adaptive layouts

## Data Flow

1. **Authentication Flow**:
   - User logs in with credentials
   - Server validates and returns JWT token
   - Client stores token and includes in API requests
   - Server validates token on protected routes

2. **Data Management Flow**:
   - React Query manages server state and caching
   - API requests go through centralized request handler
   - Database operations use Drizzle ORM with type safety
   - Real-time updates through query invalidation

3. **Role-Based Access**:
   - Route protection at component level
   - API endpoint protection with middleware
   - Dynamic UI rendering based on user role
   - Automatic redirection for unauthorized access

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **Icons**: Lucide React for modern icons
- **Date Handling**: date-fns for date manipulation
- **Form Validation**: Zod for schema validation
- **HTTP Client**: Fetch API with custom wrapper

### Backend Dependencies
- **Database**: Neon PostgreSQL serverless database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: jsonwebtoken for JWT handling
- **Session Store**: connect-pg-simple for PostgreSQL session storage

### Development Tools
- **Type Safety**: TypeScript across the entire stack
- **Code Quality**: ESLint and Prettier (implied by setup)
- **Development Server**: Vite dev server with HMR
- **Build Tools**: Vite for frontend, esbuild for backend

## Deployment Strategy

### Development Environment
- Vite development server for frontend with hot module replacement
- tsx for running TypeScript backend in development
- Environment variables for database configuration
- Replit integration with development banner and cartographer

### Production Build
- Frontend: Vite builds optimized static assets to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Single deployment artifact with static file serving
- Environment-based configuration for database connections

### Database Management
- Drizzle Kit for schema migrations
- PostgreSQL database with connection pooling
- Schema definitions in shared directory for type consistency
- Database URL configuration through environment variables

The application follows a modern full-stack architecture with strong type safety, role-based security, and scalable data management patterns. The modular design allows for easy extension of shop types and user roles while maintaining code consistency and developer experience.