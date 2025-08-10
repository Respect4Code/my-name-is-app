# My Name Is - Phonics Learning App

### Overview
"My Name Is" is a progressive web application designed to teach phonics through personalized flashcards generated from children's names. It aims to create interactive, accessible learning experiences that build reading skills using a child's own name or any chosen name. The project's vision is to be a revolutionary social readiness platform, empowering children and even adult English as a Second Language (ESL) learners globally by building confident English pronunciation.

### User Preferences
Preferred communication style: Simple, everyday language.

**Family Voice Recording Philosophy**: The app supports familiar family voices (one or both parents, elder siblings) that would actually be present when using the app with the child. This creates the bonding and learning experience magic - children have been hearing these voices since they were in the womb. While the core value is parent voices, any familiar family member can record to maintain the emotional connection during learning.

**Content Preferences**:
- "Why I Made This App" testimonial must stay permanently - never remove until explicitly told
- "What is your name?" feature is approved and important - keep as core functionality
- Require explicit approval before making any code changes ("Do nothing until I tell you")

### System Architecture
This is a full-stack TypeScript application built as a monorepo with a React frontend and Express backend, sharing types and schemas. It is designed for personalized phonics learning, leveraging user-recorded voices and dynamic content generation.

**Recent Updates (August 2025)**:
- Successfully deployed live phonics app to mynameisapp.co.uk domain
- Resolved React build and deployment issues with proper Vite configuration
- Fixed BoredMama branding with correct purple gradient logo display
- Implemented complete 6-recording system including "What is your name?" social confidence feature
- Enhanced Parent Guide with refined testimonial text emphasizing phonetic "sounding out" approach
- Updated footer messaging for open source roadmap
- Removed all private browsing detection code for improved user trust and simplified experience
- Added close button (X) to Share modal for better UX on browser and mobile
- Improved Share modal visibility with stronger colors and hover effects
- App fully functional, properly branded, and deployment-ready with working SEO

**Frontend Architecture:**
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: React hooks, React Query for server state
- **UI Components**: Radix UI primitives, custom shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables
- **Build Tool**: Vite

**Backend Architecture:**
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API**: RESTful endpoints
- **Development**: Hot reloading with `tsx`

**Key Features & Components:**
- **Dynamic Flashcard Generation**: From any name input, supporting letter-by-letter recording.
- **Client-Side Components**: Welcome Screen, Flashcard Component (3D flip cards), Flashcards Screen, Settings Modal.
- **Accessibility**: Speech Synthesis (Web Speech API), Visual Mode (high contrast, reduced motion), Keyboard Navigation, Touch Gestures, Screen Reader Support (ARIA, semantic HTML).
- **Progressive Web App (PWA)**: Service worker for offline functionality, web app manifest, responsive design.
- **Audio Recording System**: Supports family voice recordings for letter sounds and names, with features like auto-saving, preview/save/re-record workflow, and progress tracking.
- **Data Flow**: Name input → Phonics Generation → Card Display → Audio Synthesis → Navigation → Settings Persistence (localStorage).
- **User Experience**: Streamlined interface, optimized for toddler readability, social sharing capabilities (WhatsApp, Snapchat, Facebook, X).

**System Design Choices:**
- **Privacy-first**: Photos (if used) and recordings remain on-device via localStorage/IndexedDB.
- **Robust Persistence**: IndexedDB with localStorage fallback for data integrity.
- **Scalable SEO**: Comprehensive meta tags, structured data, sitemaps, and hreflang tags for global reach across 65+ countries and target audiences (parents, global ESL learners, adult ESL professionals).
- **UI/UX Decisions**: Clean, uncluttered design focusing on phonics education, clear navigation labels, optimized letter visibility, and intuitive recording workflow.

### External Dependencies

**UI and Styling:**
- **Radix UI**: Accessible component primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: Icon library.
- **Class Variance Authority**: Component variant management.

**State Management and Data:**
- **React Query (TanStack Query)**: Server state management.
- **React Hook Form**: Form handling with validation.
- **Zod**: Schema validation.

**Development and Build:**
- **Vite**: Build tool and dev server.
- **TypeScript**: Type safety.
- **ESBuild**: Production bundling.
- **PostCSS**: CSS processing.

**PWA and Performance:**
- **Web Speech API**: Browser-native text-to-speech.
- **Service Worker**: Offline functionality and caching.

**Database (Configured but Not Currently Used):**
- **Drizzle ORM**: Type-safe database operations.
- **PostgreSQL**: Database (configured for Neon serverless).
- **Drizzle Kit**: Database migrations and schema management.