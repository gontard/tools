# Vercel Deployment Setup

## Summary

Automatic Vercel deployments configured for the tools monorepo. Push to `main` triggers deployment.

## Architecture

```
tools/
├── vercel.json              # Triggers build.sh
├── build.sh                 # Generates .vercel/output/ (Build Output API)
├── index.html               # Landing page listing all tools
├── hello-world/
│   └── index.html           # Static test page
└── hello-api/
    ├── index.html           # Frontend with API call button
    ├── package.json         # Tool's own dependencies
    └── api/
        └── hello.js         # Serverless function source
```

At deploy time, `build.sh` generates:

```
.vercel/output/
├── config.json              # Routes configuration
├── static/                  # All static files
│   ├── index.html
│   ├── hello-world/
│   └── hello-api/
└── functions/               # Serverless functions
    └── api/hello-api/hello.func/
        ├── index.js
        └── .vc-config.json
```

## Key Decisions

- **Build Output API**: Full control over deployment structure
- **Self-contained tools**: Each tool has its own folder with `api/` subfolder for functions
- **No committed `/api/`**: Functions generated at build time from tool folders
- **Single Vercel project** for all tools

## Adding New Tools

### Static tool
1. Create `new-tool/index.html`
2. Add route to `build.sh` config section
3. Add card to root `index.html`

### Tool with backend
1. Create `new-tool/` with:
   - `index.html` (frontend)
   - `package.json` (dependencies, optional)
   - `api/function.js` (serverless function)
2. Add route to `build.sh` config section
3. Add card to root `index.html`
4. Build script auto-discovers tools with `api/` folders

## Vercel Setup (One-time)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `gontard/tools` repository
3. Configure:
   - Framework Preset: `Other`
   - Root Directory: `.`
   - Build Command: `./build.sh` (auto-detected from vercel.json)
4. Deploy

## URLs

After deployment:
- Landing page: `https://<project>.vercel.app/`
- Static tool: `https://<project>.vercel.app/hello-world`
- API tool: `https://<project>.vercel.app/hello-api`
- API endpoint: `https://<project>.vercel.app/api/hello-api/hello`

## Local Testing

```bash
./build.sh
# Output in .vercel/output/
```
