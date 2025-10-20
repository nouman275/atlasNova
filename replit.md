# CompressHub - File Compression Website

## Overview
CompressHub is a beautiful, modern file compression website built with pure HTML, CSS, and JavaScript. Inspired by Compress2Go, it provides client-side file compression without uploading files to any server.

## Current State
The website is fully functional with three compression tools:

### Tools Implemented
1. **Image Compression** - Compress PNG, JPG, GIF, and WebP images
   - Adjustable quality slider (10%-100%)
   - Automatic resizing for large images (> 2048px)
   - Converts to optimized JPEG format
   
2. **PDF Compression** - Optimize PDF documents
   - Page scaling for oversized documents
   - Object stream compression
   
3. **ZIP Archive Creation** - Create compressed ZIP files
   - Multiple file support
   - DEFLATE compression level 9

## Technology Stack
- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript
- **Libraries** (via CDN):
  - JSZip 3.10.1 - ZIP archive creation
  - pdf-lib 1.17.1 - PDF manipulation
  - Canvas API - Image compression

## Features
- ✨ Modern gradient design with animations
- 🌟 Animated starfield background
- 📱 Fully responsive layout
- 🔒 100% client-side processing (secure)
- ⚡ Drag-and-drop file upload
- 📊 Real-time progress indicators
- 💾 One-click file downloads
- 🎨 Beautiful hover effects and transitions

## File Structure
```
/
├── index.html      # Main HTML structure
├── style.css       # Styles and animations
├── script.js       # Compression logic and UI interactions
└── replit.md       # This file
```

## How It Works
1. User selects a compression tool (Image, PDF, or ZIP)
2. Files are uploaded via drag-and-drop or file picker
3. Compression happens entirely in the browser using JavaScript
4. Compressed files are available for instant download

## Recent Changes
- October 20, 2025: Initial implementation
  - Created beautiful landing page with hero section
  - Implemented three compression tools
  - Added smooth animations and transitions
  - Set up HTTP server workflow on port 5000

## Running the Project
The project runs on a simple Python HTTP server:
```bash
python -m http.server 5000
```

Access the website at `http://localhost:5000`

## Security
All file processing happens client-side in the browser. No files are uploaded to any server, ensuring complete privacy and security.
