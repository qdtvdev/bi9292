# Location Tracker

## Overview

A stealth location tracking application that appears as a completely black screen to visitors while secretly collecting their IP-based location data and sending it to a Discord webhook. The application uses a Flask backend with a hidden tracking system that fetches location data from the ipapi.co service and forwards detailed location information to Discord via webhook notifications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Stealth Interface**: Completely black screen with no visible elements
- **Silent Tracking**: Hidden jQuery-based AJAX requests to fetch location data
- **Security Evasion**: Disabled right-click, F12, and common developer shortcuts
- **No Visual Feedback**: All operations happen silently without user knowledge
- **API Integration**: Client-side AJAX calls to ipapi.co service followed by backend Discord webhook calls

### Backend Architecture
- **Web Framework**: Flask with Discord webhook integration
- **Routing Strategy**: Main black screen route + dedicated tracking endpoint for Discord notifications
- **Template Engine**: Jinja2 serving stealth HTML template
- **Discord Integration**: Direct webhook posting with formatted embed messages
- **Error Handling**: Silent error handling to maintain stealth operation

### Data Flow
- **Silent Data Collection**: Frontend silently queries ipapi.co API for location data
- **Discord Webhook Delivery**: Location data is immediately sent to Discord webhook with formatted embeds
- **No Local Storage**: Application doesn't store location data locally, only forwards to Discord
- **Stealth Operation**: All tracking happens without any visible indication to the user

### Security Considerations
- **Environment Variables**: Session secret key configurable via environment variables
- **HTTPS External Calls**: Uses secure connections to third-party APIs
- **No Sensitive Data Storage**: No persistent storage of user location data

## External Dependencies

### Third-Party Services
- **ipapi.co**: Primary geolocation service providing IP-based location data
- **Discord Webhook**: Target webhook URL for sending location notifications
- **CDN Resources**: 
  - jQuery 3.6.0 from jQuery CDN (for AJAX requests)

### Python Dependencies
- **Flask**: Web framework for serving the stealth application
- **requests**: HTTP library for Discord webhook communication
- **Standard Library**: os, logging, json, datetime modules for configuration and data handling

### Development Tools
- **Debug Mode**: Flask debug mode enabled for development
- **Logging**: Debug-level logging configured for troubleshooting
- **Hot Reload**: Flask's built-in development server with auto-reload