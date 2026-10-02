# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
ValorisVisio is a Next.js 14 cryptocurrency comparison and scenario calculation tool. It allows users to compare their crypto holdings against other cryptocurrencies' market caps to visualize potential gains. The application includes a blog system for crypto news and articles.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Testing
The project does not currently have a testing framework configured. If tests are needed, you'll need to set up Jest or another testing framework.

## Architecture Overview

### Application Structure
- **Next.js App Router**: Uses the new `src/app/` directory structure with App Router
- **Database**: MongoDB for storing cryptocurrency data and blog articles
- **Styling**: Tailwind CSS with custom components using Radix UI primitives
- **Theme**: Dark mode support via `next-themes`

### Key Directories
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable UI components (Radix UI based)
- `src/rgcomponents/` - Application-specific React components
- `src/lib/` - Utility functions and shared logic
- `public/` - Static assets including crypto article images

### API Structure
- `GET /api/getdata` - Fetch cryptocurrency data with pagination and search
- `POST /api/getdata` - Bulk import crypto data from CoinGecko API
- `GET /api/blog` - Fetch blog articles with pagination and category filtering
- `GET /api/blog/[slug]` - Fetch individual blog article
- `POST /api/send` - Handle contact form submissions

### Database Schema
**MongoDB Collections:**
- `coins` collection: Stores cryptocurrency data from CoinGecko API
- Blog articles collection: Stores crypto news articles with metadata

### Core Components
- `GetCoinsData.js` - Cryptocurrency selector with search and pagination
- `RecentArticles.js` - Blog article listing with masonry layout
- `ThemeProvider.js` - Dark/light theme management
- `Header.js` / `Footer.js` - Layout components

### Key Features
1. **Crypto Scenario Calculator**: Main feature allowing users to input holdings and compare potential values
2. **Cryptocurrency Search**: Real-time searchable dropdown with pagination
3. **Blog System**: Dynamic blog with articles, categories, and individual post pages
4. **Responsive Design**: Mobile-first responsive layout
5. **SEO Optimized**: Proper metadata, Open Graph, and structured data

## External Dependencies

### Editorial quality layer (TypeSafe Jev)
`src/lib/jev.js` is a never-throwing client for TypeSafe's System One model
Jev (`POST /v1/systemone`, `JEV_API_KEY` in `.env`). `POST /api/blog` uses it
in three places (all no-ops when the key is missing or `noJev: true` in the
body / `NO_JEV=1` env): angle steering (Choice) injected into the writer
prompt, a QC gate (4 questions, one writer retry, then `warnings` in the
response), and semantic dedupe (Noul vs. the 20 most recent posts). Thresholds
live in `src/app/api/blog/route.js`. Docs: `docs/internal-bot.md`.

### API Integration
- **CoinGecko API**: Used for fetching real-time cryptocurrency data
- **MongoDB**: Primary database for storing crypto data and blog content
- **Nodemailer**: For handling contact form emails

### Important Configuration
- MongoDB connection string required in `MONGODB` environment variable
- Image domains configured for CoinGecko and application assets
- Google Analytics tracking implemented

## Development Notes

### Code Patterns
- Uses custom `rgcomponents` prefix for application-specific components
- Implements pagination patterns for both crypto data and blog articles
- Uses Radix UI primitives with custom styling
- Google Analytics events tracked via `gtagEvent` utility

### Database Operations
- Crypto data updates via upsert operations to prevent duplicates
- Implements rate limiting delays when fetching from external APIs
- Search functionality uses MongoDB regex queries

### State Management
- Uses React hooks for local state management
- No global state management library (Redux, Zustand) currently implemented

## Common Development Tasks

### Adding New Crypto Features
1. Extend the `GetCoinsData` component for new selection criteria
2. Update API routes in `/api/getdata/` for additional data fields
3. Modify database queries to support new filtering options

### Blog System Modifications
1. Blog articles stored in MongoDB with slug-based routing
2. Category system implemented for article organization
3. Image handling configured for blog article thumbnails

### Styling Updates
- Tailwind CSS classes used throughout
- Custom CSS in `globals.css` for additional styling
- Dark mode classes automatically handled by theme provider

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
