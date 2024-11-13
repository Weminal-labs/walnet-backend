class NumberUtils {
  constructor() {}

  /**
   * Get random number in range [min, max].
   * @param {number} min
   * @param {number} max
   * @returns
   */
  getRandom(min = 0, max = 10) {
    return Math.floor(Math.random() * (min + max + 1));
  }
}

module.exports = NumberUtils;
