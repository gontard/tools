# YouTube Transcript Extractor - Implementation Plan

## Overview
A simple web tool to extract transcripts from YouTube videos, deployable on Vercel with serverless functions.

## Architecture

### Frontend
- Single self-contained `index.html` file
- Embedded CSS for styling
- Embedded JavaScript for functionality
- Calls backend API to fetch transcripts

### Backend
- Vercel Serverless Function at `/api/transcript.js`
- Uses `youtube-transcript` npm package
- Handles CORS for browser requests
- Extracts video ID from various YouTube URL formats

### Deployment
- Vercel platform (free tier)
- GitHub integration for auto-deploy
- No server management required

## Technical Constraints

### Why Not GitHub Pages?
- GitHub Pages only serves static files
- Cannot run server-side code (Node.js)
- CORS restrictions prevent direct YouTube API access from browser

### Why Vercel?
- Supports static files + serverless functions
- Easy GitHub integration
- Generous free tier
- Automatic HTTPS and CDN

## File Structure

```
youtube-transcript-tool/
├── index.html              # Main frontend page (self-contained)
├── api/
│   └── transcript.js       # Serverless function for fetching transcripts
├── package.json            # Dependencies for serverless function
├── README.md               # Setup and deployment instructions
└── PLAN.md                 # This file
```

## Implementation Steps

### 1. Create package.json
- Define project metadata
- Add `youtube-transcript` dependency
- Configure for Vercel serverless functions

### 2. Build Serverless API Function (`api/transcript.js`)

**Functionality:**
- Accept POST requests with YouTube URL in request body
- Extract video ID from various URL formats:
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
  - `https://www.youtube.com/embed/VIDEO_ID`
- Use `youtube-transcript` library to fetch transcript
- Return JSON response with transcript data or error message
- Handle CORS headers to allow browser requests

**Error Handling:**
- Invalid URL format
- Video not found
- No captions available
- Rate limiting from YouTube
- Network errors

### 3. Create HTML Page (`index.html`)

**Structure:**
- Single HTML file with embedded `<style>` and `<script>` tags
- Self-contained (no external dependencies)

**UI Components:**
- Text input field for YouTube URL
  - Placeholder text with example URL
  - Input validation
- Submit button to trigger extraction
- Loading indicator (spinner or text) while fetching
- Transcript display area
  - Formatted text with line breaks
  - Scrollable container
- Error message display area
  - Clear error messages
  - Hidden when no error

**Styling (CSS):**
- Clean, minimal design
- Responsive layout (works on mobile)
- Good contrast and readability
- Loading states

**JavaScript Functionality:**
- Form submission handler
- Fetch API call to `/api/transcript`
- Display loading state during request
- Parse and display transcript response
- Show error messages on failure
- Clear previous results on new submission

### 4. Testing

**Local Testing:**
- Install Vercel CLI: `npm i -g vercel`
- Run locally: `vercel dev`
- Test with various YouTube URLs:
  - Videos with auto-generated captions
  - Videos with manual captions
  - Videos without captions (should show error)
  - Invalid URLs (should show error)

**Production Testing:**
- Deploy to Vercel
- Test from different devices/browsers
- Verify CORS headers work correctly
- Check error handling

### 5. Documentation (README.md)

**Include:**
- Project description
- Features
- Tech stack
- Local development setup
- Deployment instructions
- Usage instructions
- Limitations and known issues
- License

## API Specification

### Endpoint: `POST /api/transcript`

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "transcript": [
    {
      "text": "Never gonna give you up",
      "duration": 3.5,
      "offset": 0
    },
    ...
  ]
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "No captions available for this video"
}
```

## Deployment Process

### Option 1: GitHub Integration (Recommended)
1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Sign up/login with GitHub
4. Click "New Project"
5. Import your GitHub repository
6. Vercel auto-detects configuration
7. Click "Deploy"
8. Done! Your site is live

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (from project root)
vercel

# Follow prompts
# Site URL will be provided
```

## Limitations & Considerations

### Technical Limitations
- Relies on unofficial YouTube transcript API (may break if YouTube changes)
- Some videos don't have captions available
- Rate limiting possible with heavy usage
- Only works for public YouTube videos

### Legal Considerations
- Using unofficial YouTube APIs may violate Terms of Service
- For personal/educational use only
- Commercial use requires careful review

### Future Enhancements (Optional)
- Show timestamps with transcript
- Copy to clipboard button
- Download as TXT/JSON
- Search within transcript
- Support for multiple languages
- Better error messages with suggestions

## Success Criteria

✅ User can paste YouTube URL
✅ Tool extracts and displays transcript
✅ Clear error messages for failures
✅ Works on Vercel (deployed and accessible)
✅ Self-contained HTML (no external JS dependencies for frontend)
✅ Responsive design (works on mobile)
✅ Loading states for better UX

## Timeline

This is a minimal implementation - should take:
- Setup: 15 minutes
- Serverless function: 30 minutes
- HTML/CSS/JS: 45 minutes
- Testing & debugging: 30 minutes
- Documentation: 15 minutes

**Total: ~2.5 hours**
