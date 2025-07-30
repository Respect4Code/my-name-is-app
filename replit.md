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
✓ Enhanced with auto-play, "Sing name" and "Rhyme time" recording options
✓ Improved letter display for toddler readability and fixed navigation issues
✓ Created final deployment bundle with all files for immediate Replit deployment

## Current Status
- **✅ PRODUCTION-READY RECORDING APP**: Professional-grade phonics learning application built for busy parents
- **Friends & family sharing focus**: Designed for word-of-mouth recommendations and social sharing
- **Zero-tolerance quality**: One chance to impress - bulletproof error handling and user experience
- **Advanced recording interface**: Preview/save/re-record workflow preventing parent frustration
- **Professional features**: Progress tracking, storage usage display, countdown timers, comprehensive tooltips
- **Robust recording system**: Multiple audio format support, graceful error recovery, auto-advance
- **Parent-optimized guide**: 4-minute setup respecting busy schedules with clear instructions
- **Reliable persistence**: IndexedDB with localStorage fallback ensuring no data loss
- **Tooltip positioning fixed**: User-reported overlay issue resolved - tooltips no longer block recording controls  
- **Auto-save recording system**: Eliminated user confusion by auto-saving recordings 2 seconds after stopping - no manual save button required
- **Progress tracking restored**: Fixed critical bug where recordings completed but progress showed "0 of 9 done" - now properly tracks completion
- **Complete recording workflow**: Users can record, auto-save, play back, and re-record with intuitive purple play and blue refresh buttons
- **Flashcard UX improved**: Removed confusing disabled state on "Play Letter Sound" button - all buttons now work immediately without requiring "Name" to be pressed first
- **Marketing copy accuracy**: Fixed three technical inaccuracies - corrected letter interactivity description, clarified mobile audio requirements, updated parent voice messaging to be more inclusive
- **Deployment verified**: Clean production build, TypeScript error-free, ready for real parent use
- **Name length extended**: Increased from 20 to 26 letters to support full alphabet names 
- **Photo screen eliminated**: App now flows Welcome → Recording → Flashcards (no photo upload)
- **Cache-busting implemented**: Version 2.3 with headers to force fresh browser loading
- **Social sharing added**: Interactive share button with WhatsApp, Facebook, X, and copy link functionality - optimized for friends & family viral growth
- **Dual share strategy**: Share buttons on both Welcome (discovery excitement) and Flashcard screens (joy moment after hearing child's voice)
- **Snapchat integration**: Added Snapchat sharing for perfect parent-friendly viral content - personal voice recordings are ideal for Snapchat stories
- **Clean 2x2 share grid**: Removed Copy Link for perfect 4-platform layout (WhatsApp, Snapchat, Facebook, X) - streamlined UX with most important social platforms
- **Clear navigation labels**: Added "Previous Letter" and "Next Letter" text labels under navigation buttons for improved usability and parent-friendly interface
- **Optimized flashcard design**: Removed BoredMama logo from flashcard screen to eliminate visual conflicts with child's name and maximize space for phonics learning
- **Enhanced letter visibility**: Increased letter size to text-9xl for optimal toddler readability and focus during phonics practice
- **Streamlined learning interface**: Clean, uncluttered flashcard design focused purely on phonics education without brand distractions
- **Recording timeout updated**: Extended recommended recording time from 10 to 15 seconds to accommodate longer names up to 26 letters
- **Footer spacing improved**: Added white space separation for "Revolutionising Motherhood" tagline to prevent visual crowding
- **SEO optimization implemented**: Comprehensive meta tags, structured data, and keyword targeting for educational app discovery
- **Content marketing strategy**: Created expert blog content targeting long-tail keywords like "how to teach your child their name"
- **Local SEO integration**: Added USA-specific keywords for targeted parent audience discovery