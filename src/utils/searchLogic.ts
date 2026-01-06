export interface ResultDetail {
  term: string;
  score: number;
  lenDiff: number;
}

export class SearchEngine {
  /**
   * Normalizes text: lowercase, removes accents, and strips non-alphanumeric chars.
   */
  public static sanitize(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, '');
  }

  /**
   * Checks for non-alphanumeric characters.
   */
  public static containsNonAlphanumeric(text: string): boolean {
    if (!text) return false;
    const alphaNumericRegex = /^[a-z0-9]+$/;
    return !alphaNumericRegex.test(text.toLowerCase());
  }

  /**
   * Calculates similarity based on character replacements only using a sliding window.
   */
  public static getDifferenceScore(src: string, dest: string): number {
    if (dest.length < src.length) return Infinity;
    let minDiff = Infinity;

    for (let i = 0; i <= dest.length - src.length; i++) {
      let currentDiff = 0;
      for (let j = 0; j < src.length; j++) {
        if (src[j] !== dest[i + j]) currentDiff++;
      }
      if (currentDiff < minDiff) minDiff = currentDiff;
    }
    return minDiff;
  }

  /**
   * Main function to get N suggestions.
   */
  public static getDetailedSuggestions(searchTerm: string, list: string[], n: number): ResultDetail[] {
    const sClean = this.sanitize(searchTerm);
    if (!sClean || list.length === 0) return [];

    return list
      .map(term => {
        const tClean = this.sanitize(term);
        return {
          term,
          score: this.getDifferenceScore(sClean, tClean),
          lenDiff: Math.abs(tClean.length - sClean.length)
        };
      })
      .filter(res => res.score !== Infinity)
      .sort((a, b) => (a.score - b.score) || (a.lenDiff - b.lenDiff) || a.term.localeCompare(b.term))
      .slice(0, n);
  }
}