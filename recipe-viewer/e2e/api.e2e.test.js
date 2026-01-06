import { describe, test, expect } from 'vitest';

const BASE_URL =
  process.env.E2E_BASE_URL || 'https://tools-wheat-two.vercel.app';
const API_ENDPOINT = `${BASE_URL}/api/recipe-viewer/extract`;

// Stable test recipe (popular, unlikely to be removed)
const TEST_RECIPE_URL =
  'https://www.marmiton.org/recettes/recette_roti-de-boeuf-au-four-tout-simple_342546.aspx';

describe('Recipe Viewer API - E2E', () => {
  describe('Happy path', () => {
    test('extracts recipe from Marmiton URL', async () => {
      const response = await fetch(
        `${API_ENDPOINT}?url=${encodeURIComponent(TEST_RECIPE_URL)}`
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.recipe).toBeDefined();
      expect(data.recipe.title).toBeTruthy();
      expect(Array.isArray(data.recipe.ingredients)).toBe(true);
      expect(data.recipe.ingredients.length).toBeGreaterThan(0);
      expect(Array.isArray(data.recipe.steps)).toBe(true);
      expect(data.recipe.steps.length).toBeGreaterThan(0);
    });

    test('response includes all expected fields', async () => {
      const response = await fetch(
        `${API_ENDPOINT}?url=${encodeURIComponent(TEST_RECIPE_URL)}`
      );
      const data = await response.json();

      expect(data.recipe.title).toEqual(expect.any(String));
      expect(data.recipe.ingredients).toEqual(expect.any(Array));
      expect(data.recipe.steps).toEqual(expect.any(Array));
      expect(data.recipe.duration).toBeDefined();
    });

    test('ingredients have parsed structure', async () => {
      const response = await fetch(
        `${API_ENDPOINT}?url=${encodeURIComponent(TEST_RECIPE_URL)}`
      );
      const data = await response.json();

      for (const ingredient of data.recipe.ingredients) {
        expect(ingredient).toHaveProperty('raw');
        expect(ingredient).toHaveProperty('quantity');
        expect(ingredient).toHaveProperty('unit');
        expect(ingredient).toHaveProperty('name');
        expect(typeof ingredient.raw).toBe('string');
        expect(typeof ingredient.name).toBe('string');
      }
    });
  });

  describe('Error handling', () => {
    test('returns 400 for missing URL parameter', async () => {
      const response = await fetch(API_ENDPOINT);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_URL');
    });

    test('returns 400 for invalid URL', async () => {
      const response = await fetch(`${API_ENDPOINT}?url=not-a-valid-url`);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_URL');
    });

    test('returns 404 for non-recipe page', async () => {
      const response = await fetch(
        `${API_ENDPOINT}?url=${encodeURIComponent('https://www.google.com')}`
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('NO_RECIPE_DATA');
    });
  });

  describe('CORS', () => {
    test('includes CORS headers in response', async () => {
      const response = await fetch(
        `${API_ENDPOINT}?url=${encodeURIComponent(TEST_RECIPE_URL)}`
      );

      expect(response.headers.get('access-control-allow-origin')).toBe('*');
    });
  });

  describe('Content type', () => {
    test('returns JSON content type', async () => {
      const response = await fetch(
        `${API_ENDPOINT}?url=${encodeURIComponent(TEST_RECIPE_URL)}`
      );

      expect(response.headers.get('content-type')).toContain('application/json');
    });
  });
});
