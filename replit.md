# Story Weaver - AI-Powered Creative Writing Platform

## Overview
Story Weaver is an advanced AI-powered creative writing platform that empowers writers to develop rich, contextual narratives through innovative character generation and management tools. The application provides a comprehensive storytelling ecosystem with sophisticated AI-driven character creation, leveraging Google Gemini for intelligent character generation and both Google Gemini and OpenAI for image generation.

## Recent Changes
### July 24, 2025
✓ Fixed TypeScript errors in image generation and character generation files
✓ Fixed missing property references in the routes file  
✓ Successfully started the Story Weaver application on port 5000
✓ Implemented fallback mechanism for image generation (Gemini → OpenAI)
✓ Database connection is working properly
✓ All server endpoints are now operational

## Project Architecture

### Technology Stack
- **Frontend**: React.js with TypeScript, Tailwind CSS, React Query
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: Google Gemini AI for character generation, Google Gemini + OpenAI for image generation
- **Development**: Vite for build system, tsx for TypeScript execution

### Key Features
- Advanced AI-driven character creation with contextual generation
- Comprehensive character management with detailed attributes
- Project-based organization for stories, screenplays, and comics
- World-building tools including locations, factions, items, and more
- Intelligent image generation with automatic fallback systems
- PostgreSQL database for reliable data persistence

### Current Status
- Application is running successfully on port 5000
- Character generation is working with Google Gemini AI
- Image generation supports both Gemini and OpenAI with automatic fallback
- Database operations are functional
- All TypeScript compilation errors have been resolved

## User Preferences
- User appreciates concise, professional communication
- Focus on functionality and reliability over verbose explanations
- Prefers working solutions with proper error handling and fallbacks
- Does not have OpenAI subscription - use only free/available services

## API Keys Configuration
- ✅ GOOGLE_API_KEY: Configured for Gemini AI services
- ❌ OPENAI_API_KEY: Available but user doesn't have subscription
- ✅ DATABASE_URL: PostgreSQL connection configured

## Known Issues
- Gemini image generation implementation updated to use official API structure
- TypeScript warnings for experimental responseModalities feature (non-breaking)
- Character generation works perfectly with Gemini
- Some dialog components show accessibility warnings (non-critical)

## Next Steps
- Monitor image generation performance
- Consider implementing image caching for better performance
- Potential UI/UX improvements based on user feedback