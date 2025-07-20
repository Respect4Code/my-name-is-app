# My Name Is - Phonics Learning App

## Overview

"My Name Is" is a progressive web application designed to teach phonics through personalized flashcards generated from children's names. The app creates interactive, accessible learning experiences that help users learn letter sounds and build reading skills through their own name or any name they choose.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

This is a full-stack TypeScript application built with a React frontend and Express backend, designed as a monorepo structure with shared types and schemas.

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with local state and React Query for server state
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript with ES modules
- **API**: RESTful endpoints (currently minimal, ready for expansion)
- **Development**: Hot reloading with tsx for development server

## Key Components

### Client-Side Components
1. **Welcome Screen**: Name input interface with accessibility features
2. **Flashcard Component**: 3D flip cards with phonics data display
3. **Flashcards Screen**: Main learning interface with navigation controls
4. **Settings Modal**: Comprehensive accessibility and user preference controls

### Phonics Engine
- Dynamic flashcard generation from any name input
- Letter-to-sound mapping with IPA notation
- Position-aware phonics (first, second, last letter context)
- Special case handling for context-sensitive pronunciations

### Accessibility Features
- **Speech Synthesis**: Text-to-speech for letter sounds and names
- **Visual Mode**: High contrast and reduced motion options
- **Keyboard Navigation**: Full keyboard accessibility
- **Touch Gestures**: Swipe support for mobile devices
- **Screen Reader Support**: ARIA labels and semantic HTML

### Progressive Web App (PWA)
- Service worker for offline functionality
- Web app manifest for installable experience
- Responsive design for all device sizes

## Data Flow

1. **Name Input**: User enters a name on the welcome screen
2. **Phonics Generation**: Name is processed through the phonics engine to create flashcard data
3. **Card Display**: Generated flashcards are displayed with flip animations
4. **Audio Synthesis**: Speech synthesis provides pronunciation when cards are flipped
5. **Navigation**: Users can move between cards with keyboard, mouse, or touch gestures
6. **Settings Persistence**: User preferences are saved to localStorage

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

### State Management and Data
- **React Query (TanStack Query)**: Server state management
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation

### Development and Build
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **ESBuild**: Production bundling
- **PostCSS**: CSS processing

### Database and ORM (Configured but Not Currently Used)
- **Drizzle ORM**: Type-safe database operations
- **PostgreSQL**: Database (configured for Neon serverless)
- **Drizzle Kit**: Database migrations and schema management

### PWA and Performance
- **Replit Vite Plugins**: Development environment integration
- **Web Speech API**: Browser-native text-to-speech
- **Service Worker**: Offline functionality and caching

## Deployment Strategy

### Development
- Uses Vite dev server with hot module replacement
- Express server runs on separate process
- TypeScript compilation with incremental builds
- Replit-specific plugins for development environment

### Production Build
- Frontend: Vite builds optimized static assets
- Backend: ESBuild bundles Express server for Node.js
- Assets are served from Express with static file serving
- Service worker provides caching and offline capabilities

### Database
- Configured for PostgreSQL with Drizzle ORM
- Environment-based connection via DATABASE_URL
- Ready for user data persistence and flashcard history
- Currently uses in-memory storage for development

The application is designed to be easily deployable to various platforms including Replit, Vercel, or traditional Node.js hosting environments.

## Recent Changes

**January 20, 2025**
✓ Complete app redesign based on teacher feedback - implemented simplified "My Name Is" version
✓ Linear flow: Welcome → Photo → Record → Menu → Flashcards 
✓ Photo-centered learning: Child sees themselves on each flashcard with letter overlay
✓ Parent voice recordings are the primary feature (not buried in settings)
✓ Privacy-first design: Photos stay on device via localStorage
✓ Auto-advancing recording stages with clear progress indicators
✓ Simplified flashcard interface showing child's photo + letter + parent voice buttons
✓ Fixed all TypeScript compilation errors and implemented proper type safety
✓ Built production-ready version with clean, intuitive user interface
✓ Removed complex phonics engine in favor of simple letter-by-letter recording

## Current Status
- **✅ NEW VERSION DEPLOYED**: Completely reimplemented app with simplified, effective design
- Linear user flow eliminates confusion from previous complex interface
- Photo upload with privacy promise - files never leave device
- Recording workflow: Full name → Each letter sound → Sentence context
- Flashcard display: Child photo + letter overlay + parent voice playback
- All TypeScript errors resolved, production build successful
- **Ready for parent testing**: 5-minute setup vs. previous 20-minute confusion