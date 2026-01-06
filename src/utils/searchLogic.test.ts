import { describe, it, expect } from 'vitest';
import { SearchEngine } from './searchLogic';

describe('SearchEngine Class Tests', () => {
  
  describe('getDifferenceScore (via sanitization)', () => {
    // Note: getDifferenceScore is private in the class, 
    // but we test its results through the public getDetailedSuggestions method.

    it('should return 0 for identical strings', () => {
      const results = SearchEngine.getDetailedSuggestions('gros', ['gros'], 1);
      expect(results[0].score).toBe(0);
    });

    it('should return 1 for "gros" vs "gras"', () => {
      const results = SearchEngine.getDetailedSuggestions('gros', ['gras'], 1);
      expect(results[0].score).toBe(1);
    });

    it('should handle sliding window for "gros" inside "agressif"', () => {
      // "gros" vs "gres" (part of agressif) = 1 difference ('o' vs 'e')
      const results = SearchEngine.getDetailedSuggestions('gros', ['agressif'], 1);
      expect(results[0].score).toBe(1);
    });

    it('should exclude terms if destination is shorter than source', () => {
      const results = SearchEngine.getDetailedSuggestions('gros', ['gro'], 1);
      expect(results.length).toBe(0);
    });
  });

  describe('getDetailedSuggestions (Requirement Example)', () => {
    const list = ["gros", "gras", "graisse", "agressif", "go", "ros", "gro"];

    it('should return [gros, gras] when searching for "gros" with N=2', () => {
      const result = SearchEngine.getDetailedSuggestions('gros', list, 2);
      // Mapping to get only terms for comparison
      const terms = result.map(r => r.term);
      expect(terms).toEqual(['gros', 'gras']);
    });

    it('should sort by length proximity when scores are equal', () => {
      // "abc" in "abcd" (score 0, len 4) vs "abc" in "abcde" (score 0, len 5)
      const list2 = ["abcde", "abcd"];
      const result = SearchEngine.getDetailedSuggestions('abc', list2, 2);
      const terms = result.map(r => r.term);
      expect(terms).toEqual(['abcd', 'abcde']);
    });

    it('should sort alphabetically when score and length are equal', () => {
      const list3 = ["zebra", "apple"];
      const result = SearchEngine.getDetailedSuggestions('xxxxx', list3, 2);
      const terms = result.map(r => r.term);
      expect(terms).toEqual(['apple', 'zebra']);
    });
  });

  describe('Sanitization Logic', () => {
    it('should force lowercase and remove accents', () => {
      expect(SearchEngine.sanitize('Céline')).toBe('celine');
    });

    it('should remove non-alphanumeric characters', () => {
      expect(SearchEngine.sanitize('gros-gras!')).toBe('grosgras');
    });
  });
});