# TVBS Business Ad & Project Revenue Management System

## Overview

This is a comprehensive advertising and project revenue management system for TVBS (Taiwan Television Broadcasting System). The system manages scheduling orders, program arrangements, advertising slots, and broadcast logging for television advertising operations. It's built as a full-stack web application with a React frontend and Node.js/Express backend.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom TVBS branding
- **State Management**: Zustand for navigation state, React Query for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with structured error handling
- **Middleware**: JSON parsing, URL encoding, request logging with timing

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (via Neon serverless)
- **Connection**: Neon serverless pool with WebSocket support
- **Migrations**: Drizzle Kit for schema management

## Key Components

### Authentication System
- Session-based authentication using PostgreSQL session store
- User management with profile information storage
- Replit-compatible user authentication flow

### Navigation & UI Framework
- Hierarchical sidebar navigation with collapsible menu groups
- TVBS-branded color scheme and styling
- Responsive design with mobile support
- Toast notifications and modal dialogs

### Core Business Modules

#### Scheduling Management
- **Scheduling Order Entry**: Creation and management of advertising orders
- **Daily Program Scheduling**: TV program schedule management
- **Ad Slot Management**: Channel broadcast time allocation
- **LOG Arrangement**: Detailed broadcast log creation and editing

#### Data Management
- Company and customer relationship management
- Channel and program master data
- Material and target audience categorization
- Serial number and sequence management

#### Revenue Tracking
- Dashboard with real-time statistics
- Monthly revenue calculations
- Order status and approval workflows
- Broadcast result tracking

## Data Flow

### Request Flow
1. Client makes API requests through React Query
2. Express middleware logs requests and handles CORS
3. Route handlers validate input using Zod schemas
4. Business logic interacts with Drizzle ORM
5. PostgreSQL database operations via Neon connection pool
6. Structured JSON responses with error handling

### State Management
- Server state cached and synchronized via React Query
- Navigation state managed locally with Zustand
- Form state handled by React Hook Form with Zod validation
- UI state (modals, toasts) managed by component-level state

## External Dependencies

### Core Runtime
- **@neondatabase/serverless**: PostgreSQL connection via Neon
- **drizzle-orm**: Type-safe database operations
- **express**: Web application framework
- **react**: UI library with TypeScript support

### UI & Styling
- **@radix-ui/***: Primitive UI components
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component styling variants

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Deployment Strategy

### Development
- Vite dev server with hot module replacement
- TypeScript compilation with strict type checking
- Express server with request logging and error overlay
- Database schema synchronization via Drizzle push

### Production Build
- Vite builds optimized client bundle to `dist/public`
- esbuild compiles server code to `dist/index.js`
- Single-process deployment serving both API and static files
- Environment-based configuration for database connections

### Environment Requirements
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **REPL_ID**: Replit-specific identifier (development only)

## Changelog

```
Changelog:
- July 02, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```