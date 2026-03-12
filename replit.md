# Overview

This is a Chilean payment system application built with React/TypeScript frontend and Node.js/Express backend. The application enables users to submit payment requests for vehicle loan quotas by entering their Chilean RUT (tax ID), which are then processed by administrators through a real-time admin panel. The system includes Chilean RUT validation, WebSocket-based real-time communication, and integration with Billpocket (MANAGEMENT CONSULTING) payment gateway for payment processing.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with custom theming support via theme.json
- **State Management**: TanStack React Query for server state, local React state for UI
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Communication**: Custom WebSocket hook for bidirectional communication

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Module System**: ESM (ES Modules) throughout the entire application
- **Real-time Communication**: WebSocket server using 'ws' library for admin-user coordination
- **Data Storage**: In-memory storage with Drizzle ORM prepared for PostgreSQL integration
- **API Design**: RESTful endpoints with WebSocket fallback for real-time features

## Payment Processing Architecture
- **Primary Provider**: Efipay (efipay.co) payment gateway in test mode, Chilean peso (CLP) payments
- **Payment Flow**: Backend creates payment via Efipay API → user redirected to Efipay hosted checkout → Efipay sends webhook with result
- **API Endpoints**: Base URL `https://sag.efipay.co`; primary endpoint `/api/v1/payment/generate-payment` with fallback to `/api/v1/payment/generate-transaction`
- **Webhook**: POST /api/efipay-webhook receives payment results; GET /api/efipay-return handles user redirect back
- **Security**: Server-side amount calculation prevents client tampering; Token stored as EFIPAY_TEST_KEY secret
- **RUT Validation**: Chilean tax ID validation with checksum verification

## Real-time Communication Design
- **WebSocket Management**: Separate client pools for administrators and regular users
- **State Synchronization**: Real-time updates between admin panel and user waiting screens
- **Connection Recovery**: Automatic reconnection and state restoration for interrupted connections
- **User Session Tracking**: Persistent session management across page refreshes

## Data Architecture
- **Schema Definition**: Shared TypeScript interfaces between client and server
- **Database Ready**: Drizzle configuration prepared for PostgreSQL with Neon serverless
- **Storage Strategy**: Memory-based storage for active sessions, database for persistence
- **Data Validation**: Zod schemas for runtime validation (implied by dependencies)

# External Dependencies

## Payment Providers
- **Efipay**: Primary payment processor via redirect-based checkout API (test mode, CLP currency)
- **Efipay API**: REST API at sag.efipay.co for payment generation and transaction management; token stored as EFIPAY_TEST_KEY

## Database Services
- **Neon Database**: Serverless PostgreSQL provider via `@neondatabase/serverless`
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect configuration

## UI and Styling
- **Radix UI**: Comprehensive primitive component library for accessible UI components
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Shadcn Theme System**: Dynamic theming via `@replit/vite-plugin-shadcn-theme-json`

## Development Tools
- **Vite**: Build tool and development server with React plugin
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Production bundling for server-side code

## Validation and Utilities
- **Chilean RUT Validation**: Custom implementation for Chilean tax ID verification
- **WebSocket Communication**: Native 'ws' library for real-time features
- **CORS**: Cross-origin resource sharing support via 'cors' middleware

## Replit-Specific Integrations
- **Cartographer**: Development tooling for Replit environment
- **Runtime Error Overlay**: Enhanced error reporting in development
- **Theme Plugin**: Integration with Replit's theming system