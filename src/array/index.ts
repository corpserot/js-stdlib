/**
 * Returns the position of the first occurance of a value. Returns -1 if the
 * value is not found.
 */
export function indexOf<T>(ar: T[], v: T, start?: number) {
  return ar.indexOf(v, start);
}

/**
 * Returns the position of the last occurance of a value. Returns -1 if the
 * value is not found.
 */
export function lastIndexOf<T>(ar: T[], v: T, start?: number) {
  return ar.lastIndexOf(v, start);
}

/**
 * Returns the position of the first non-occurance of a value. Returns -1 if the
 * value is found on every position.
 */
export function indexNotOf<T>(ar: T[], v: T, start?: number) {
  start = Math.max(0, start ?? 0);

  for (let p = start; p < ar.length; ++p) {
    if (!(ar[p] === v)) {
      return p;
    }
  }
  return -1;
}

/**
 * Returns the position of the last non-occurrence of a value. Returns -1 if the
 * value is found at every position.
 */
export function lastIndexNotOf<T>(ar: T[], v: T, start?: number) {
  start = Math.min(ar.length - 1, start ?? ar.length - 1);

  for (let p = start; p >= 0; --p) {
    if (!ar[p] === v) {
      return p;
    }
  }
  return -1;
}
