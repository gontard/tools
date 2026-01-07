import { describe, it, expect } from "vitest";
import {
  formatDuration,
  parseServings,
  ingredientToString,
  normalizeStep,
  extractImage,
  findRecipeInJsonLd,
  validateUrl,
  normalizeServings,
} from "./extract.js";

describe("formatDuration", () => {
  it("formats minutes only", () => {
    expect(formatDuration("PT5M")).toBe("5 minutes");
  });

  it("formats hours only", () => {
    expect(formatDuration("PT2H")).toBe("2 hours");
  });

  it("formats hours and minutes", () => {
    expect(formatDuration("PT1H30M")).toBe("1 hour 30 minutes");
  });

  it("uses singular for 1 hour", () => {
    expect(formatDuration("PT1H")).toBe("1 hour");
  });

  it("uses singular for 1 minute", () => {
    expect(formatDuration("PT1M")).toBe("1 minute");
  });

  it("formats seconds when no hours/minutes", () => {
    expect(formatDuration("PT45S")).toBe("45 seconds");
  });

  it("returns null for null input", () => {
    expect(formatDuration(null)).toBeNull();
  });

  it("returns null for invalid duration", () => {
    expect(formatDuration("invalid")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(formatDuration("")).toBeNull();
  });
});

describe("parseServings", () => {
  it("extracts number from string with text", () => {
    expect(parseServings("4 personnes")).toBe(4);
  });

  it("extracts number from servings string", () => {
    expect(parseServings("6 servings")).toBe(6);
  });

  it("returns number as-is", () => {
    expect(parseServings(8)).toBe(8);
  });

  it("returns null for null input", () => {
    expect(parseServings(null)).toBeNull();
  });

  it("returns null for string without number", () => {
    expect(parseServings("some text")).toBeNull();
  });
});

describe("ingredientToString", () => {
  it("returns string as-is", () => {
    expect(ingredientToString("200g flour")).toBe("200g flour");
  });

  it("formats object with name and amount", () => {
    expect(ingredientToString({ name: "flour", amount: "200g" })).toBe(
      "200g flour"
    );
  });

  it("returns name when no amount", () => {
    expect(ingredientToString({ name: "salt" })).toBe("salt");
  });

  it("returns text property if present", () => {
    expect(ingredientToString({ text: "2 cups sugar" })).toBe("2 cups sugar");
  });

  it("converts non-string non-object to string", () => {
    expect(ingredientToString(123)).toBe("123");
  });
});

describe("normalizeStep", () => {
  it("returns string as-is", () => {
    expect(normalizeStep("Mix ingredients")).toBe("Mix ingredients");
  });

  it("extracts text property from HowToStep", () => {
    expect(normalizeStep({ "@type": "HowToStep", text: "Mix well" })).toBe(
      "Mix well"
    );
  });

  it("falls back to name property", () => {
    expect(normalizeStep({ name: "Step 1: Prepare" })).toBe("Step 1: Prepare");
  });

  it("converts non-string non-object to string", () => {
    expect(normalizeStep(42)).toBe("42");
  });
});

describe("extractImage", () => {
  it("returns string URL as-is", () => {
    expect(extractImage("https://example.com/img.jpg")).toBe(
      "https://example.com/img.jpg"
    );
  });

  it("extracts first URL from array", () => {
    expect(
      extractImage([
        "https://example.com/1.jpg",
        "https://example.com/2.jpg",
      ])
    ).toBe("https://example.com/1.jpg");
  });

  it("extracts url property from object", () => {
    expect(extractImage({ url: "https://example.com/img.jpg" })).toBe(
      "https://example.com/img.jpg"
    );
  });

  it("extracts @id property from object", () => {
    expect(extractImage({ "@id": "https://example.com/img.jpg" })).toBe(
      "https://example.com/img.jpg"
    );
  });

  it("returns null for null input", () => {
    expect(extractImage(null)).toBeNull();
  });

  it("handles nested array with object", () => {
    expect(extractImage([{ url: "https://example.com/nested.jpg" }])).toBe(
      "https://example.com/nested.jpg"
    );
  });
});

describe("findRecipeInJsonLd", () => {
  it("returns null for null input", () => {
    expect(findRecipeInJsonLd(null)).toBeNull();
  });

  it("finds Recipe in direct object", () => {
    const data = { "@type": "Recipe", name: "Test" };
    expect(findRecipeInJsonLd(data)).toEqual(data);
  });

  it("finds Recipe in array", () => {
    const recipe = { "@type": "Recipe", name: "Test" };
    const data = [{ "@type": "WebPage" }, recipe];
    expect(findRecipeInJsonLd(data)).toEqual(recipe);
  });

  it("finds Recipe in @graph container", () => {
    const recipe = { "@type": "Recipe", name: "Test" };
    const data = { "@graph": [{ "@type": "Organization" }, recipe] };
    expect(findRecipeInJsonLd(data)).toEqual(recipe);
  });

  it("handles Recipe as array type", () => {
    const recipe = { "@type": ["Article", "Recipe"], name: "Test" };
    expect(findRecipeInJsonLd(recipe)).toEqual(recipe);
  });

  it("returns null when no Recipe found", () => {
    const data = { "@type": "WebPage", name: "Test" };
    expect(findRecipeInJsonLd(data)).toBeNull();
  });
});

describe("validateUrl", () => {
  it("rejects missing URL", () => {
    const result = validateUrl(undefined);
    expect(result.valid).toBe(false);
    expect(result.error.code).toBe("INVALID_URL");
  });

  it("rejects invalid URL format", () => {
    const result = validateUrl("not-a-url");
    expect(result.valid).toBe(false);
    expect(result.error.code).toBe("INVALID_URL");
  });

  it("rejects non-HTTP protocols", () => {
    const result = validateUrl("ftp://example.com");
    expect(result.valid).toBe(false);
    expect(result.error.code).toBe("INVALID_URL");
  });

  it("accepts valid HTTP URL", () => {
    const result = validateUrl("http://example.com/recipe");
    expect(result.valid).toBe(true);
    expect(result.parsedUrl).toBeDefined();
  });

  it("accepts valid HTTPS URL", () => {
    const result = validateUrl("https://example.com/recipe");
    expect(result.valid).toBe(true);
    expect(result.parsedUrl).toBeDefined();
  });
});

describe("normalizeServings", () => {
  it("returns null for null input", () => {
    expect(normalizeServings(null)).toBeNull();
  });

  it("returns string as-is", () => {
    expect(normalizeServings("4 personnes")).toBe("4 personnes");
  });

  it("returns first element of array", () => {
    expect(normalizeServings(["4 servings", "4"])).toBe("4 servings");
  });

  it("formats number with servings suffix", () => {
    expect(normalizeServings(6)).toBe("6 servings");
  });
});
