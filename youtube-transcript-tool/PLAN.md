# YouTube Transcript Extractor

## Goal

Web tool to extract transcripts from YouTube videos. Users paste a YouTube URL and get the transcript text. Useful for content creators, researchers, and anyone needing video transcripts.

## Architecture

- **Type**: Frontend + Backend (Vercel serverless)
- **Stack**:
  - Frontend: HTML5, CSS3, vanilla JavaScript (single file)
  - Backend: Node.js serverless function, `youtube-transcript` npm package
- **Why Vercel**: GitHub Pages can't run server-side code; CORS prevents direct YouTube API access from browser
- **Files**:
  ```
  youtube-transcript-tool/
  ├── PLAN.md
  ├── index.html
  ├── api/
  │   └── transcript.js
  ├── package.json
  └── README.md
  ```

## Steps

- [ ] Step 1: Create package.json with youtube-transcript dependency
- [ ] Step 2: Implement serverless function (api/transcript.js)
- [ ] Step 3: Create index.html with input form and results area
- [ ] Step 4: Add CSS styling (clean, responsive)
- [ ] Step 5: Implement JavaScript for form submission and API calls
- [ ] Step 6: Add loading states and error handling UI
- [ ] Step 7: Test locally with `vercel dev`
- [ ] Step 8: Write README with setup and deployment instructions

## Specifications

### API Endpoint: POST /api/transcript

**Request:**
```json
{ "url": "https://www.youtube.com/watch?v=VIDEO_ID" }
```

**Success Response (200):**
```json
{
  "success": true,
  "transcript": [
    { "text": "...", "duration": 3.5, "offset": 0 }
  ]
}
```

**Error Response (4xx/5xx):**
```json
{ "success": false, "error": "Error message" }
```

### Supported URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

### UI Components

- Text input for YouTube URL (placeholder with example)
- Submit button
- Loading spinner/indicator
- Transcript display area (scrollable, formatted)
- Error message area (red, dismissible)

### Error Cases

| Error | Message |
|-------|---------|
| Invalid URL | "Please enter a valid YouTube URL" |
| Video not found | "Video not found" |
| No captions | "No captions available for this video" |
| Network error | "Failed to fetch transcript. Please try again." |

## Testing

- Video with auto-generated captions → transcript displayed
- Video with manual captions → transcript displayed
- Video without captions → error message
- Invalid URL (e.g., "not-a-url") → validation error
- YouTube URL with no video ID → error message
- Test on mobile viewport → responsive layout

## Acceptance Criteria

- [ ] User can paste YouTube URL and see transcript
- [ ] Clear error messages for all failure cases
- [ ] Loading indicator while fetching
- [ ] Works on Vercel deployment
- [ ] Self-contained HTML frontend (no external JS dependencies)
- [ ] Responsive design on mobile
