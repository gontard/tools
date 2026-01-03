# Tools Repository

Collection of simple, self-contained tools for learning and productivity.

## Structure

```
tools/
├── <tool-name>/
│   ├── PLAN.md          # Implementation plan
│   └── <implementation> # Tool files
└── ...
```

Each tool lives in its own folder with a PLAN.md and implementation files.

## Design Principles

### Self-Contained
- Minimal external dependencies
- No shared code between tools
- Each tool works independently

### Simple
- Single-purpose tools
- Clear, focused functionality
- Easy to understand and modify

## Architecture Patterns

**Single HTML File** - Use for:
- Educational demos
- Visualizations
- Simple utilities
- Example: `reflected-xss-demo`

**Frontend + Backend** - Use for:
- API integrations
- Data processing requiring server-side code
- Example: `youtube-transcript-tool`

## Technical Choices

### Frontend
- Pure HTML5, CSS3, vanilla JavaScript
- No frameworks for simple tools
- Inline styles/scripts for single-file tools
- Mobile-first responsive design

### Backend (when needed)
- Vercel serverless functions
- Node.js runtime
- Minimal dependencies

### Styling Conventions
- CSS custom properties for theming
- Flexbox/Grid for layouts
- Semantic HTML elements

### Security (for demos)
- Sanitize all user input
- No actual vulnerabilities
- Educational warnings where appropriate

## Deployment

**Static tools (HTML only):**
- GitHub Pages
- Direct file serving

**Tools with backend:**
- Vercel (GitHub integration)
- Serverless functions in tool's `api/` subfolder (e.g., `hello-api/api/hello.js`)
- Build Output API: `build.sh` generates `.vercel/output/` at deploy time
- Functions use ESM (`export default function handler(req, res)`)
- See `VERCEL_DEPLOY.md` for details

## File Naming

| File | Purpose |
|------|---------|
| `PLAN.md` | Implementation plan (required) |
| `index.html` | Main entry point for web tools |
| `api/` | Serverless functions directory |
| `README.md` | Usage documentation (optional) |
