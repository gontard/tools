import * as cheerio from "cheerio";
import { parse as parseDuration, toSeconds } from "iso8601-duration";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * Extract all JSON-LD blocks from the page
 */
function extractJsonLd($) {
  const results = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const content = $(el).html();
      if (content) {
        results.push(JSON.parse(content));
      }
    } catch {
      // Invalid JSON, skip
    }
  });
  return results;
}

/**
 * Recursively search for Recipe type in JSON-LD data
 * Handles arrays, @graph containers, and nested structures
 */
function findRecipeInJsonLd(data) {
  if (!data) return null;

  if (Array.isArray(data)) {
    for (const item of data) {
      const found = findRecipeInJsonLd(item);
      if (found) return found;
    }
    return null;
  }

  if (typeof data === "object") {
    // Check if this is a Recipe
    const type = data["@type"];
    if (type === "Recipe" || (Array.isArray(type) && type.includes("Recipe"))) {
      return data;
    }

    // Check @graph container
    if (data["@graph"]) {
      return findRecipeInJsonLd(data["@graph"]);
    }
  }

  return null;
}

/**
 * Format ISO 8601 duration to human-readable string
 * e.g., "PT5M" -> "5 minutes", "PT1H30M" -> "1 hour 30 minutes"
 */
function formatDuration(iso) {
  if (!iso) return null;

  try {
    const duration = parseDuration(iso);
    const parts = [];

    if (duration.hours) {
      parts.push(`${duration.hours} hour${duration.hours > 1 ? "s" : ""}`);
    }
    if (duration.minutes) {
      parts.push(`${duration.minutes} minute${duration.minutes > 1 ? "s" : ""}`);
    }
    if (duration.seconds && parts.length === 0) {
      parts.push(`${duration.seconds} second${duration.seconds > 1 ? "s" : ""}`);
    }

    return parts.length > 0 ? parts.join(" ") : null;
  } catch {
    return null;
  }
}

/**
 * Normalize ingredient to string
 * Handles both string and object formats
 */
function normalizeIngredient(ingredient) {
  if (typeof ingredient === "string") {
    return ingredient;
  }
  if (typeof ingredient === "object" && ingredient !== null) {
    // Handle HowToSupply or structured ingredient
    if (ingredient.name) {
      return ingredient.amount
        ? `${ingredient.amount} ${ingredient.name}`
        : ingredient.name;
    }
    if (ingredient.text) {
      return ingredient.text;
    }
  }
  return String(ingredient);
}

/**
 * Normalize step to string
 * Handles both string and HowToStep objects
 */
function normalizeStep(step) {
  if (typeof step === "string") {
    return step;
  }
  if (typeof step === "object" && step !== null) {
    return step.text || step.name || String(step);
  }
  return String(step);
}

/**
 * Extract first image URL from various formats
 */
function extractImage(image) {
  if (!image) return null;
  if (typeof image === "string") return image;
  if (Array.isArray(image)) {
    return extractImage(image[0]);
  }
  if (typeof image === "object") {
    return image.url || image["@id"] || null;
  }
  return null;
}

/**
 * Normalize raw recipe data to standard format
 */
function normalizeRecipe(raw) {
  const ingredients = Array.isArray(raw.recipeIngredient)
    ? raw.recipeIngredient.map(normalizeIngredient)
    : [];

  const steps = Array.isArray(raw.recipeInstructions)
    ? raw.recipeInstructions.map(normalizeStep)
    : [];

  // Handle servings - can be string or object
  let servings = null;
  if (raw.recipeYield) {
    if (typeof raw.recipeYield === "string") {
      servings = raw.recipeYield;
    } else if (Array.isArray(raw.recipeYield)) {
      servings = raw.recipeYield[0];
    } else if (typeof raw.recipeYield === "number") {
      servings = `${raw.recipeYield} servings`;
    }
  }

  return {
    title: raw.name || null,
    description: raw.description || null,
    image: extractImage(raw.image),
    duration: {
      prep: formatDuration(raw.prepTime),
      cook: formatDuration(raw.cookTime),
      total: formatDuration(raw.totalTime),
    },
    servings,
    ingredients,
    steps,
  };
}

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: { code: "METHOD_NOT_ALLOWED", message: "Only GET requests allowed" },
    });
  }

  const { url } = req.query;

  // Validate URL
  if (!url) {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_URL", message: "URL parameter is required" },
    });
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_URL", message: "URL must use HTTP or HTTPS" },
    });
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_URL", message: "URL must use HTTP or HTTPS" },
    });
  }

  // Fetch the page with timeout
  let html;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.status === 403) {
      return res.status(403).json({
        success: false,
        error: { code: "BLOCKED", message: "Website blocked our request" },
      });
    }

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        error: {
          code: "FETCH_FAILED",
          message: `Could not fetch the page (HTTP ${response.status})`,
        },
      });
    }

    html = await response.text();
  } catch (err) {
    if (err.name === "AbortError") {
      return res.status(504).json({
        success: false,
        error: { code: "TIMEOUT", message: "Request timed out" },
      });
    }
    return res.status(502).json({
      success: false,
      error: { code: "FETCH_FAILED", message: "Could not fetch the page" },
    });
  }

  // Parse HTML and extract JSON-LD
  const $ = cheerio.load(html);
  const jsonLdBlocks = extractJsonLd($);

  let recipe = null;
  for (const block of jsonLdBlocks) {
    recipe = findRecipeInJsonLd(block);
    if (recipe) break;
  }

  if (!recipe) {
    return res.status(404).json({
      success: false,
      error: { code: "NO_RECIPE_DATA", message: "No structured recipe data found" },
    });
  }

  return res.status(200).json({
    success: true,
    recipe: normalizeRecipe(recipe),
  });
}
