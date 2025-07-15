# Bus Location Tracking System

## Overview

This is a real-time bus location tracking system designed for Shri Venkateshwara Padmavathy Engineering College. The system enables drivers to share their location and allows students to track bus movements across multiple routes. The application features a dual-interface design with separate views for students and drivers (admin).

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and build process
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Styling**: CSS variables for theming with college branding colors

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **API Design**: RESTful API with JSON responses

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Session Storage**: PostgreSQL-based session storage

## Key Components

### Database Schema
The system uses four main tables:
- **drivers**: Stores driver credentials and route assignments
- **routes**: Defines bus routes with descriptions and stop counts
- **stops**: Individual bus stops with scheduled times for each route
- **busLocations**: Real-time location data with GPS coordinates and status

### Frontend Components
- **Header**: College branding with logo and QR code for Google Maps
- **GoogleMap**: Interactive map component for displaying bus locations
- **RouteCard**: Individual route display with status indicators
- **RouteDetailsModal**: Detailed view of route stops and schedules
- **AdminView**: Driver interface for location sharing
- **StudentView**: Student interface for tracking buses

### API Endpoints
- **POST /api/auth/login**: Driver authentication
- **POST /api/auth/logout**: Driver logout and location cleanup
- **POST /api/bus-locations**: Update bus location (driver only)
- **GET /api/routes**: Retrieve all routes
- **GET /api/routes/:id**: Get specific route details
- **GET /api/bus-locations**: Get all active bus locations
- **GET /api/bus-locations/:routeId**: Get location for specific route

## Data Flow

### Driver Workflow
1. Driver logs in using driverId and password
2. System validates credentials and updates driver status to active
3. Driver can share location using geolocation API
4. Location updates are sent to server with GPS coordinates
5. Driver can logout, which clears location data and sets status to inactive

### Student Workflow
1. Students access the system without authentication
2. System displays all available routes with current status
3. Students can view route details including stops and schedules
4. Real-time bus locations are displayed on Google Maps
5. Route cards show current bus status (on route, delayed, stopped, offline)

### Real-time Updates
- Location updates are stored in the database with timestamps
- Frontend polls for location updates using TanStack Query
- Bus status is determined by location activity and timestamps

## External Dependencies

### Google Maps Integration
- Google Maps JavaScript API for interactive mapping
- Geolocation API for driver location sharing
- Custom map styling to hide unnecessary POIs

### UI Components
- Radix UI primitives for accessible components
- Lucide React for consistent iconography
- Class Variance Authority for component variants

### Development Tools
- ESBuild for server-side bundling
- TSX for TypeScript execution in development
- Replit-specific plugins for development environment

## Deployment Strategy

### Build Process
- Frontend: Vite builds the React application to `dist/public`
- Backend: ESBuild bundles the Express server to `dist/index.js`
- Database: Drizzle migrations are applied during deployment

### Environment Configuration
- DATABASE_URL: PostgreSQL connection string for Neon database
- VITE_GOOGLE_MAPS_API_KEY: Google Maps API key for frontend
- NODE_ENV: Environment flag for development/production behavior

### Production Deployment
- Server serves static files from `dist/public`
- Express handles API routes and SSR fallback
- Database migrations are managed through Drizzle Kit
- Session storage uses PostgreSQL for persistence

### Development Setup
- Hot module replacement via Vite development server
- Automatic TypeScript compilation
- Database schema changes via `npm run db:push`
- Development server runs on Express with Vite middleware

The system architecture prioritizes real-time updates, user experience, and maintainability while providing a robust platform for bus tracking within the college campus.