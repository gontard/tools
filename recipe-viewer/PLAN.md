# Recipe Viewer

## Goal

Extract and display recipes from any URL in a clean, distraction-free format. Users paste a recipe URL (e.g., from Marmiton) and see only the essential information: title, timing, servings, ingredients, and steps. Users can adjust the serving count to scale ingredient quantities. Designed for use while cooking - no ads, no life stories, just the recipe.

## Architecture

- **Type**: Frontend + Backend
- **Stack**:
  - Frontend: Pure HTML5/CSS3/vanilla JS (no frameworks)
  - Backend: Vercel serverless function (Node.js)
  - Dependencies: `cheerio` (HTML parsing), `iso8601-duration` (time parsing)
- **Files**:
  ```
  recipe-viewer/
  ├── PLAN.md
  ├── index.html
  ├── package.json
  └── api/
      └── extract.js
  ```

## Steps

- [x] Step 1: Create package.json with dependencies
- [x] Step 2: Implement api/extract.js with JSON-LD extraction
- [x] Step 3: Add Microdata fallback to api/extract.js
- [x] Step 4: Implement index.html frontend
- [x] Step 5: Test with Marmiton and other recipe sites
- [ ] Step 6: Add configurable servings with ingredient scaling

## Specifications

### Backend: api/extract.js

**Endpoint:** `GET /api/recipe-viewer/extract?url=<encoded-url>`

**Success Response (200):**
```json
{
  "success": true,
  "recipe": {
    "title": "Rôti de boeuf au four",
    "description": "A simple roast beef recipe",
    "image": "https://example.com/photo.jpg",
    "duration": {
      "prep": "5 minutes",
      "cook": "25 minutes",
      "total": "30 minutes"
    },
    "servings": "2 personnes",
    "servingsCount": 2,
    "ingredients": [
      { "raw": "400 g de rôti de boeuf bardé", "quantity": 400, "unit": "g", "name": "rôti de boeuf bardé" },
      { "raw": "1 gousses d'ail", "quantity": 1, "unit": null, "name": "gousses d'ail" }
    ],
    "steps": [
      "Préchauffer le four à 220°C",
      "Enfourner pour 15 minutes"
    ]
  }
}
```

**Error Responses:**
| Code | HTTP | Message |
|------|------|---------|
| INVALID_URL | 400 | URL must use HTTP or HTTPS |
| NO_RECIPE_DATA | 404 | No structured recipe data found |
| BLOCKED | 403 | Website blocked our request |
| TIMEOUT | 504 | Request timed out |
| FETCH_FAILED | 502 | Could not fetch the page |

**Fetch Configuration:**
- Timeout: 10 seconds (with AbortController)
- User-Agent: Spoof browser User-Agent to avoid blocks
- Example: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36`

**Extraction Strategy:**
1. Primary: JSON-LD with `@type: "Recipe"` (handles `@graph` containers)
2. Fallback: Microdata with `itemtype="http://schema.org/Recipe"`
3. No heuristic HTML parsing (too brittle)

**Key Functions:**
- `extractJsonLd($)` - Find all `<script type="application/ld+json">` blocks
- `findRecipeInJsonLd(data)` - Recursive search handling arrays and @graph
- `extractMicrodata($)` - Parse itemprop attributes
- `normalizeRecipe(raw)` - Convert to standard response format
  - Handles ingredients as strings OR objects with `name`/`amount`
  - Extracts first image from array if multiple provided
- `formatDuration(iso)` - Convert "PT5M" to "5 minutes"
- `parseServings(str)` - Extract numeric count from "2 personnes" → 2
- `parseIngredient(str)` - Parse "400 g de boeuf" → `{ raw, quantity, unit, name }`
  - Regex pattern: `^(\d+(?:[.,]\d+)?)\s*([a-zA-Z]+)?\s*(.+)$`
  - Returns `{ raw: str, quantity: null, unit: null, name: str }` if parsing fails

### Frontend: index.html

**Layout (Desktop):**
```
┌─────────────────────────────────────────┐
│  [URL input field]  [Extract button]    │
├─────────────────────────────────────────┤
│  [Image]  Title                         │
│           Description text here...      │
│           Prep: 5 min | Cook: 25 min    │
├───────────────────┬─────────────────────┤
│  Ingredients      │  Steps              │
│  [-] 2 [+] serv.  │  1. Preheat oven    │
│  - 400g beef      │  2. Roast 15 min    │
│  - 1 garlic       │  3. Season and rest │
│  - 2 tbsp oil     │                     │
└───────────────────┴─────────────────────┘
```

**Layout (Mobile):** Single column - image, title, description, meta, ingredients, then steps.

**Configurable Servings:**
- Display serving selector above ingredients list: `[-] 2 [+] servings`
- Buttons increment/decrement serving count (min: 1, max: 99)
- Ingredient quantities scale proportionally: `newQty = originalQty × (newServings / originalServings)`
- Display scaled quantities with smart formatting:
  - Whole numbers: display as-is (e.g., "2")
  - Decimals: round to 1 decimal place, trim trailing zeros (e.g., "1.5", not "1.50")
  - Fractions near common values: consider ½, ¼, ¾ display (optional enhancement)
- Ingredients without parseable quantities show original text (no scaling)
- Persist selected servings in URL: `?url=...&servings=4`

**Shareable URLs:**
- On page load, check for `?url=` query parameter
- If present, auto-populate input and trigger extraction
- After successful extraction, update URL with `?url=<encoded-url>` (using `history.replaceState`)
- Enables bookmarking and sharing extracted recipes

**States:**
- Empty: Just input field
- Loading: Button disabled, spinner icon, "Extracting recipe..." text (clear feedback so site doesn't look stuck)
- Error: Red message with helpful text
- Success: Recipe displayed

**Styling:**
- CSS custom properties for colors
- System font stack
- Max-width container (800px)
- Grid layout for ingredients/steps
- Mobile breakpoint at 600px

### Dependencies (package.json)

```json
{
  "type": "module",
  "dependencies": {
    "cheerio": "^1.0.0",
    "iso8601-duration": "^2.1.2"
  }
}
```

## Testing

- **Marmiton**: https://www.marmiton.org/recettes/recette_roti-de-boeuf-au-four-tout-simple_342546.aspx
  - Expected: Title "Rôti de boeuf au four tout simple", image, description, 7 ingredients, 3 steps
- **Non-recipe URL**: https://www.google.com
  - Expected: Error "No structured recipe data found"
- **Invalid URL**: "not-a-url"
  - Expected: Error "URL must use HTTP or HTTPS"
- **Serving scaling**: Load Marmiton recipe (2 servings), change to 4 servings
  - Expected: "400 g de rôti" → "800 g de rôti", "1 gousses d'ail" → "2 gousses d'ail"
- **Shareable scaled recipe**: Copy URL with `?url=...&servings=4`, paste in new tab
  - Expected: Recipe loads with 4 servings pre-selected and scaled quantities

## Acceptance Criteria

- [ ] Marmiton recipes extract correctly (title, image, description, times, servings, ingredients, steps)
- [ ] ISO 8601 durations display as human-readable text (PT5M → "5 minutes")
- [ ] Error messages are clear and helpful
- [ ] Loading state shows spinner (site never looks stuck)
- [ ] Layout is responsive (desktop: 2 columns, mobile: 1 column)
- [ ] Shareable URLs work (copy URL → paste in new tab → same recipe loads)
- [ ] No external fonts, frameworks, or unnecessary dependencies
- [ ] Serving selector adjusts ingredient quantities proportionally
- [ ] Scaled quantities display cleanly (no excessive decimals)
- [ ] Servings persist in URL for sharing scaled recipes
