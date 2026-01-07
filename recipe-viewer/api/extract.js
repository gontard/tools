import * as cheerio from "cheerio";
import { parse as parseDuration, toSeconds } from "iso8601-duration";
import { parseIngredient } from "./lib/parseIngredient.js";

// Constants
const FETCH_TIMEOUT_MS = 10000;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const ACCEPT_HEADER =
  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
const ACCEPT_LANGUAGE = "en-US,en;q=0.5";

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
 * Extract recipe from Microdata (schema.org/Recipe)
 * Fallback when JSON-LD is not available
 */
function extractMicrodata($) {
  const recipeEl = $('[itemtype*="schema.org/Recipe"]');
  if (recipeEl.length === 0) return null;

  const getItemprop = (prop) => {
    const el = recipeEl.find(`[itemprop="${prop}"]`).first();
    if (el.length === 0) return null;
    return (
      el.attr("content") ||
      el.attr("datetime") ||
      el.attr("src") ||
      el.attr("href") ||
      el.text().trim() ||
      null
    );
  };

  const getAllItemprop = (prop) => {
    const values = [];
    recipeEl.find(`[itemprop="${prop}"]`).each((_, el) => {
      const $el = $(el);
      const value =
        $el.attr("content") ||
        $el.attr("datetime") ||
        $el.text().trim();
      if (value) values.push(value);
    });
    return values;
  };

  // Get image - might be in img src or content attribute
  const imageEl = recipeEl.find('[itemprop="image"]').first();
  let image = null;
  if (imageEl.length) {
    image =
      imageEl.attr("src") ||
      imageEl.attr("content") ||
      imageEl.attr("href") ||
      null;
  }

  return {
    name: getItemprop("name"),
    description: getItemprop("description"),
    image,
    prepTime: getItemprop("prepTime"),
    cookTime: getItemprop("cookTime"),
    totalTime: getItemprop("totalTime"),
    recipeYield: getItemprop("recipeYield"),
    recipeIngredient: getAllItemprop("recipeIngredient"),
    recipeInstructions: getAllItemprop("recipeInstructions"),
  };
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
 * Extract numeric serving count from servings string
 * e.g., "2 personnes" -> 2, "4 servings" -> 4
 */
function parseServings(str) {
  if (!str) return null;
  if (typeof str === "number") return str;
  const match = String(str).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}


/**
 * Normalize ingredient to string (for internal use)
 * Handles both string and object formats
 */
function ingredientToString(ingredient) {
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
 * Normalize ingredients from raw recipe data
 * @param {Array} rawIngredients - Raw ingredient list
 * @returns {Array} - Parsed ingredients with quantity, unit, name
 */
function normalizeIngredients(rawIngredients) {
  if (!Array.isArray(rawIngredients)) return [];
  return rawIngredients.map(ingredientToString).map(parseIngredient);
}

/**
 * Normalize steps from raw recipe data
 * @param {Array} rawInstructions - Raw instructions list
 * @returns {Array} - Normalized step strings
 */
function normalizeSteps(rawInstructions) {
  if (!Array.isArray(rawInstructions)) return [];
  return rawInstructions.map(normalizeStep);
}

/**
 * Normalize raw recipe data to standard format
 */
function normalizeRecipe(raw) {
  const servings = normalizeServings(raw.recipeYield);

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
    servingsCount: parseServings(servings),
    ingredients: normalizeIngredients(raw.recipeIngredient),
    steps: normalizeSteps(raw.recipeInstructions),
  };
}

/**
 * Fetch HTML content from URL with timeout and content-type validation
 * @param {string} url - URL to fetch
 * @returns {Promise<{ok: boolean, html?: string, error?: {status: number, code: string, message: string}}>}
 */
async function fetchHtml(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: ACCEPT_HEADER,
        "Accept-Language": ACCEPT_LANGUAGE,
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.status === 403) {
      return {
        ok: false,
        error: { status: 403, code: "BLOCKED", message: "Website blocked our request" },
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        error: {
          status: 502,
          code: "FETCH_FAILED",
          message: `Could not fetch the page (HTTP ${response.status})`,
        },
      };
    }

    // Validate content-type
    const contentType = response.headers.get("content-type") || "";
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml")
    ) {
      return {
        ok: false,
        error: {
          status: 400,
          code: "INVALID_CONTENT_TYPE",
          message: `Expected HTML but received ${contentType.split(";")[0] || "unknown"}`,
        },
      };
    }

    return { ok: true, html: await response.text() };
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      return {
        ok: false,
        error: { status: 504, code: "TIMEOUT", message: "Request timed out" },
      };
    }
    return {
      ok: false,
      error: { status: 502, code: "FETCH_FAILED", message: "Could not fetch the page" },
    };
  }
}

/**
 * Extract recipe from parsed HTML using JSON-LD or Microdata
 * @param {CheerioAPI} $ - Cheerio instance
 * @returns {object|null} - Raw recipe data or null
 */
function extractRecipe($) {
  // Try JSON-LD first (primary method)
  const jsonLdBlocks = extractJsonLd($);
  for (const block of jsonLdBlocks) {
    const recipe = findRecipeInJsonLd(block);
    if (recipe) return recipe;
  }

  // Fall back to Microdata
  return extractMicrodata($);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: { code: "METHOD_NOT_ALLOWED", message: "Only GET requests allowed" },
    });
  }

  const urlValidation = validateUrl(req.query.url);
  if (!urlValidation.valid) {
    return res.status(400).json({ success: false, error: urlValidation.error });
  }

  const fetchResult = await fetchHtml(req.query.url);
  if (!fetchResult.ok) {
    return res
      .status(fetchResult.error.status)
      .json({ success: false, error: { code: fetchResult.error.code, message: fetchResult.error.message } });
  }

  const $ = cheerio.load(fetchResult.html);
  const recipe = extractRecipe($);

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

/**
 * Validate URL parameter
 * @param {string|undefined} url - URL to validate
 * @returns {{valid: boolean, parsedUrl?: URL, error?: {code: string, message: string}}}
 */
function validateUrl(url) {
  if (!url) {
    return {
      valid: false,
      error: { code: "INVALID_URL", message: "URL parameter is required" },
    };
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return {
      valid: false,
      error: { code: "INVALID_URL", message: "URL must use HTTP or HTTPS" },
    };
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return {
      valid: false,
      error: { code: "INVALID_URL", message: "URL must use HTTP or HTTPS" },
    };
  }

  return { valid: true, parsedUrl };
}

/**
 * Normalize servings from various formats
 * @param {string|number|Array|null} recipeYield - Raw servings value
 * @returns {string|null} - Normalized servings string
 */
function normalizeServings(recipeYield) {
  if (!recipeYield) return null;
  if (typeof recipeYield === "string") return recipeYield;
  if (Array.isArray(recipeYield)) return recipeYield[0];
  if (typeof recipeYield === "number") return `${recipeYield} servings`;
  return null;
}

// Named exports for testing
export {
  formatDuration,
  parseServings,
  ingredientToString,
  normalizeStep,
  extractImage,
  findRecipeInJsonLd,
  validateUrl,
  normalizeServings,
};
