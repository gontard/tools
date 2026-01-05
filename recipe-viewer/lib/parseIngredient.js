/**
 * Parse ingredient string into structured format
 * Supports both standard and inverted formats:
 * - Standard: "400 g de boeuf" -> { quantity: 400, unit: "g", name: "boeuf" }
 * - Inverted: "Oignons - 50 grammes" -> { quantity: 50, unit: "grammes", name: "Oignons" }
 */
export function parseIngredient(str) {
  const raw = str;

  // Common units to recognize (including French)
  const unitPattern =
    /^(g|kg|ml|cl|l|oz|lb|cup|cups|tbsp|tsp|cuillères?\s+à\s+(?:soupe|café)|c\.\s*à\s*[sc]|cs|cc|pincée|sachet|tranche|gousse|brin|feuille)s?\b/i;

  // Match: quantity (with decimals), optional unit, rest is name
  const match = str.match(/^(\d+(?:[.,]\d+)?)\s*/);

  if (match) {
    const quantity = parseFloat(match[1].replace(",", "."));
    const rest = str.slice(match[0].length);

    // Try to match a known unit
    const unitMatch = rest.match(unitPattern);
    if (unitMatch) {
      const unit = unitMatch[0].trim();
      const name = rest.slice(unitMatch[0].length).trim();
      // Remove leading "de ", "d'" from name
      const cleanName = name.replace(/^d[e']?\s*/i, "").trim();
      return { raw, quantity, unit, name: cleanName || name };
    }

    // No known unit - check if it's a simple "number + name" pattern
    // e.g., "1 oignon" or "2 tomates"
    return { raw, quantity, unit: null, name: rest.trim() };
  }

  // No quantity found - return unparseable ingredient
  return { raw, quantity: null, unit: null, name: str };
}
