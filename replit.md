# SEO Analysis Tool

## Overview

This is a full-stack web application that provides SEO analysis for blog posts and websites. The application allows users to input URLs and receive comprehensive SEO insights powered by AI analysis. It features a modern React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preference: Glass morphism design throughout the website with blur effects, transparency, and modern aesthetics.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database)
- **External Services**: OpenAI API for SEO analysis, web scraping for content extraction

### Development Setup
- **Monorepo Structure**: Client, server, and shared code in separate directories
- **Development Server**: Vite dev server with Express API proxy
- **TypeScript**: Shared types and schemas across frontend and backend

## Key Components

### Database Schema
- **Users Table**: Basic user management with username/password authentication
- **SEO Analyses Table**: Stores analysis results with URL, content metadata, scores, metrics, and recommendations
- **Shared Types**: TypeScript interfaces for SEO metrics, recommendations, and blog content

### API Endpoints
- **POST /api/analyze**: Main endpoint that accepts a URL, scrapes content, analyzes with AI, and stores results
- **Error Handling**: Centralized error handling with structured JSON responses

### Core Services
- **Web Scraper**: Extracts blog content including title, meta description, headings, and main content
- **OpenAI Integration**: Analyzes content for SEO metrics and provides actionable recommendations
- **Storage Layer**: Abstracted storage interface with in-memory implementation (ready for database integration)

### UI Components
- **Dashboard**: Main analysis interface with URL input and results display
- **Progress Indicators**: Circular progress components for SEO scores
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints

## Data Flow

1. **User Input**: User enters URL in the dashboard interface
2. **Content Extraction**: Backend scrapes the webpage for title, meta description, content, and structure
3. **AI Analysis**: Content is sent to OpenAI API for comprehensive SEO evaluation
4. **Score Calculation**: AI returns overall score, detailed metrics, and specific recommendations
5. **Data Storage**: Analysis results are stored in PostgreSQL database
6. **Results Display**: Frontend receives analysis data and renders interactive dashboard with scores and recommendations

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection for serverless environments
- **drizzle-orm**: Type-safe database ORM with schema migrations
- **OpenAI**: AI-powered SEO analysis and recommendations
- **cheerio**: Server-side HTML parsing for web scraping

### UI Dependencies
- **@radix-ui/react-***: Accessible component primitives
- **@tanstack/react-query**: Server state management and caching
- **tailwindcss**: Utility-first CSS framework with custom glass morphism components
- **class-variance-authority**: Component variant management

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **vite**: Frontend build tool and development server

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public` directory
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations managed via `db:push` command

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **OPENAI_API_KEY**: OpenAI API authentication
- **NODE_ENV**: Environment detection for development/production modes

### Production Setup
- **Static Assets**: Frontend served from `dist/public`
- **API Routes**: Express server handles `/api/*` endpoints
- **Database**: PostgreSQL with connection pooling via Neon
- **Error Handling**: Structured error responses with appropriate HTTP status codes

The application is designed for easy deployment on platforms like Replit, Vercel, or similar Node.js hosting environments with built-in database support.

## Recent Changes

### January 23, 2025 - Glass Morphism Design Implementation
- ✓ Implemented modern glass morphism design throughout the entire website
- ✓ Added custom glass morphism CSS classes (.glass, .glass-strong, .glass-header)
- ✓ Updated color scheme with transparency and blur effects
- ✓ Enhanced gradient backgrounds and visual elements
- ✓ Redesigned dashboard components with frosted glass effects
- ✓ Improved typography with gradient text effects
- ✓ Added backdrop blur support for modern browsers