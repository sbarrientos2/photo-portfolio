# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Photo portfolio web application built with Next.js 16 and React 19. Features an admin dashboard for managing categories and photos, with Cloudinary for image storage and Neon PostgreSQL for the database.

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## Architecture

### App Router Structure (src/app/)

- **Page Routes**: Home (`/`), About (`/about`), Portfolio detail (`/portfolio/[id]`)
- **Admin Routes**: Dashboard (`/admin`), Login (`/admin/login`) - protected by NextAuth
- **API Routes**: `api/auth/[...nextauth]` (auth), `api/upload` (Cloudinary signatures)
- **Server Actions**: `actions.ts` contains all data mutation functions

### Key Components (src/components/)

- `AdminDashboard.tsx` - Main admin interface with drag-drop reordering (@dnd-kit)
- `ThemeProvider.tsx` / `ThemeToggle.tsx` - Dark/light theme system using CSS variables
- `Lightbox.tsx` / `PhotoGrid.tsx` - Photo display components

### Data Layer (src/lib/)

- `db.ts` - Neon PostgreSQL connection setup
- `data.ts` - CRUD operations for categories and photos (direct SQL queries)
- `auth.ts` - NextAuth v5 configuration (credential-based, password-only)

### Database Schema

Two tables: `categories` (id, title, cover_image, sort_order) and `photos` (id, category_id, src, caption, description, sort_order)

## Environment Variables

```
POSTGRES_URL or DATABASE_URL    # Neon PostgreSQL connection
ADMIN_PASSWORD                  # Admin login password
CLOUDINARY_CLOUD_NAME           # Cloudinary cloud name
CLOUDINARY_API_KEY              # Cloudinary API key
CLOUDINARY_API_SECRET           # Cloudinary API secret
```

## Styling

Tailwind CSS v4 with CSS custom properties. Theme colors defined in `globals.css`:
- Dark theme (default): charcoal (#1a1a1a), cream (#f5f1e8), gold (#d4af37)
- Light theme: activated via `data-theme="light"` on document element

Path alias: `@/*` maps to `./src/*`
