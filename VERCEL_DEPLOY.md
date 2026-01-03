# Vercel Deployment Setup

## Summary

Automatic Vercel deployments configured for the tools monorepo. Push to `main` triggers deployment.

## Architecture

```
tools/
├── vercel.json              # Routing configuration
├── index.html               # Landing page listing all tools
├── api/                     # Root API folder (Vercel requirement)
│   └── hello-api/
│       └── hello.js         # Serverless function
├── hello-world/
│   └── index.html           # Static test page
└── hello-api/
    ├── index.html           # Frontend with API call button
    └── package.json         # Tool's own dependencies
```

## Key Decisions

- **Single Vercel project** for all tools
- **API functions in root `/api/`**: Vercel requires functions in `/api/` at the root. Functions are organized as `/api/tool-name/function.js`
- **Self-contained tools**: Each tool has its own folder with frontend and optional `package.json`

## Adding New Tools

### Static tool
1. Create `new-tool/index.html`
2. Add rewrite to `vercel.json`
3. Add card to root `index.html`

### Tool with backend
1. Create `new-tool/` with:
   - `index.html` (frontend)
   - `package.json` (dependencies, optional)
2. Create `api/new-tool/function.js` (serverless function)
3. Add rewrite to `vercel.json`
4. Add card to root `index.html`

## Vercel Setup (One-time)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `gontard/tools` repository
3. Configure:
   - Framework Preset: `Other`
   - Root Directory: `.`
4. Deploy

## URLs

After deployment:
- Landing page: `https://<project>.vercel.app/`
- Static tool: `https://<project>.vercel.app/hello-world`
- API tool: `https://<project>.vercel.app/hello-api`
- API endpoint: `https://<project>.vercel.app/api/hello-api/hello`
