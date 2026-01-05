import { describe, it, expect } from "vitest";
import { parseIngredient } from "./parseIngredient.js";

describe("parseIngredient", () => {
  describe("standard format (quantity first)", () => {
    it("parses quantity with unit and name", () => {
      const result = parseIngredient("400 g de boeuf");
      expect(result).toEqual({
        raw: "400 g de boeuf",
        quantity: 400,
        unit: "g",
        name: "boeuf",
      });
    });

    it("parses quantity without unit", () => {
      const result = parseIngredient("2 oignons");
      expect(result).toEqual({
        raw: "2 oignons",
        quantity: 2,
        unit: null,
        name: "oignons",
      });
    });

    it("parses ml unit", () => {
      const result = parseIngredient("250 ml de lait");
      expect(result).toEqual({
        raw: "250 ml de lait",
        quantity: 250,
        unit: "ml",
        name: "lait",
      });
    });

    it("parses cl unit", () => {
      const result = parseIngredient("20 cl de crème");
      expect(result).toEqual({
        raw: "20 cl de crème",
        quantity: 20,
        unit: "cl",
        name: "crème",
      });
    });
  });

  describe("inverted format (name - quantity unit)", () => {
    it("parses 'Oignons - 50 grammes'", () => {
      const result = parseIngredient("Oignons - 50 grammes");
      expect(result).toEqual({
        raw: "Oignons - 50 grammes",
        quantity: 50,
        unit: "grammes",
        name: "Oignons",
      });
    });

    it("parses 'Courgettes - 650 grammes'", () => {
      const result = parseIngredient("Courgettes - 650 grammes");
      expect(result).toEqual({
        raw: "Courgettes - 650 grammes",
        quantity: 650,
        unit: "grammes",
        name: "Courgettes",
      });
    });

    it("parses 'Eau - 260 grammes'", () => {
      const result = parseIngredient("Eau - 260 grammes");
      expect(result).toEqual({
        raw: "Eau - 260 grammes",
        quantity: 260,
        unit: "grammes",
        name: "Eau",
      });
    });

    it("parses 'Beurre - 10 grammes'", () => {
      const result = parseIngredient("Beurre - 10 grammes");
      expect(result).toEqual({
        raw: "Beurre - 10 grammes",
        quantity: 10,
        unit: "grammes",
        name: "Beurre",
      });
    });

    it("parses 'Fromage à tartiner - 50 grammes'", () => {
      const result = parseIngredient("Fromage à tartiner - 50 grammes");
      expect(result).toEqual({
        raw: "Fromage à tartiner - 50 grammes",
        quantity: 50,
        unit: "grammes",
        name: "Fromage à tartiner",
      });
    });

    it("parses 'Sel - 1 pincée'", () => {
      const result = parseIngredient("Sel - 1 pincée");
      expect(result).toEqual({
        raw: "Sel - 1 pincée",
        quantity: 1,
        unit: "pincée",
        name: "Sel",
      });
    });

    it("parses 'Gousse d'ail - 1' (no unit)", () => {
      const result = parseIngredient("Gousse d'ail - 1");
      expect(result).toEqual({
        raw: "Gousse d'ail - 1",
        quantity: 1,
        unit: null,
        name: "Gousse d'ail",
      });
    });

    it("parses 'Fond de légumes - 1 cuillère à soupe'", () => {
      const result = parseIngredient("Fond de légumes - 1 cuillère à soupe");
      expect(result).toEqual({
        raw: "Fond de légumes - 1 cuillère à soupe",
        quantity: 1,
        unit: "cuillère à soupe",
        name: "Fond de légumes",
      });
    });
  });

  describe("edge cases", () => {
    it("handles decimal quantities", () => {
      const result = parseIngredient("1,5 kg de pommes");
      expect(result).toEqual({
        raw: "1,5 kg de pommes",
        quantity: 1.5,
        unit: "kg",
        name: "pommes",
      });
    });

    it("handles no quantity", () => {
      const result = parseIngredient("Sel et poivre");
      expect(result).toEqual({
        raw: "Sel et poivre",
        quantity: null,
        unit: null,
        name: "Sel et poivre",
      });
    });
  });
});
