import { describe, it, expect } from 'vitest';
import { SearchEngine } from './utils/searchLogic'; // Importez la classe

describe('Algorithm Requirements', () => {
  it('identifies "gros" as 0 difference', () => {
    // Appelez la méthode via la classe SearchEngine
    expect(SearchEngine.getDifferenceScore('gros', 'gros')).toBe(0);
  });

  it('identifies "gras" as 1 difference', () => {
    expect(SearchEngine.getDifferenceScore('gros', 'gras')).toBe(1);
  });

  it('rejects "gro" because it is shorter than "gros"', () => {
    expect(SearchEngine.getDifferenceScore('gros', 'gro')).toBe(Infinity);
  });

  it('finds "gros" inside "agressif" with 1 difference', () => {
    expect(SearchEngine.getDifferenceScore('gros', 'agressif')).toBe(1);
  });
});