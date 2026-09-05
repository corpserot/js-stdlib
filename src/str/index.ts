/**
 * Returns reversed string. Only unicode code point aware.
 */
export function reverse(s: string) {
  // oxlint-disable-next-line typescript/no-misused-spread
  return [...s].reverse().join('');
}

/**
 * Returns the position of the first occurance of a substring. Returns -1 if
 * substring is not found, or unable to search. Only UTF-16 code unit aware.
 *
 * @param start Start position of the search. Defaults to string start.
 */
export function indexOf(s: string, sub: string, start?: number) {
  return s.indexOf(sub, start);
}

/**
 * Returns the position of the last occurance of a substring. Returns -1 if
 * substring is not found, or unable to search. Only UTF-16 code unit aware.
 *
 * @param start Start position of the search. Defaults to string end.
 */
export function lastIndexOf(s: string, sub: string, start?: number) {
  return s.lastIndexOf(sub, start);
}

/**
 * Returns the position of the first non-occurance of a substring. Returns -1 if
 * substring is found on every position, or unable to search. Only UTF-16 code
 * unit aware.
 *
 * @param start Start position of the search. Defaults to string start.
 */
export function indexNotOf(s: string, sub: string, start?: number) {
  const slen = s.length;
  const sublen = sub.length;
  if (sublen === 0 && slen === 0) {
    return 0;
  }
  if (sublen === 0 || slen === 0) {
    return -1;
  }

  start = Math.max(0, Math.trunc(start ?? 0));
  const stop = slen - (sublen - 1);
  if (start >= slen) {
    return -1;
  }
  if (start >= stop) {
    return start;
  }
  for (let p = start; p < stop; ++p) {
    if (!s.startsWith(sub, p)) {
      return p;
    }
  }
  return -1;
}

/**
 * Returns the position of the last non-occurrence of a substring. Returns -1 if
 * the substring is found at every position, or unable to search. Only UTF-16
 * code unit aware.
 *
 * @param start Start position of the search. Defaults to string end.
 */
export function lastIndexNotOf(s: string, sub: string, start?: number) {
  const slen = s.length;
  const sublen = sub.length;
  if (sublen === 0 && slen === 0) {
    return 0;
  }
  if (sublen === 0) {
    return -1;
  }

  start = Math.min(slen - sublen, Math.trunc(start ?? slen - sublen));
  for (let p = start; p >= 0; --p) {
    if (!s.startsWith(sub, p)) {
      return p;
    }
  }
  return -1;
}

/**
 * Returns the position of the first occurance of any substrings. Returns -1 if
 * none of the substrings are found, or unable to search. Only UTF-16 code unit
 * aware.
 *
 * @param start Start position of the search. Defaults to string start.
 */
export function indexOfAny(s: string, subs: string[], start?: number) {
  if (subs.includes('')) {
    return 0;
  }

  let min = s.length;
  for (const sub of subs) {
    const found = s.indexOf(sub, start);
    if (found >= 0 && found < min) {
      min = found;
    }
  }
  return min === s.length ? -1 : min;
}

/**
 * Returns the position of the last occurrence of any substrings. Returns -1 if
 * none of the substrings are found, or unable to search. Only UTF-16 code unit
 * aware.
 *
 * @param start Start position of the search. Defaults to string end.
 */
export function lastIndexOfAny(
  s: string,
  subs: string[],
  start?: number,
): number {
  if (subs.includes('')) {
    return -1;
  }

  let max = -1;
  for (const sub of subs) {
    const found = s.lastIndexOf(sub, start);
    if (found > max) {
      max = found;
    }
  }
  return max;
}

/**
 * Returns the position of the first non-occurance of any substrings. Returns -1
 * if any of the substrings are found, or unable to search. Only UTF-16 code
 * unit aware.
 *
 * @param start Start position of the search. Defaults to string start.
 */
export function indexOfNone(s: string, subs: string[], start?: number) {
  if (subs.includes('')) {
    return -1;
  }
  start = Math.max(0, Math.trunc(start ?? 0));

  const memoize: number[] = new Array(subs.length).fill(-1);
  let min = Number.MAX_SAFE_INTEGER;
  for (const sub of subs) {
    min = Math.min(min, sub.length);
  }
  const stop = s.length - min;
  next: for (let p = start; p < stop; ++p) {
    for (let i = 0; i < subs.length; ++i) {
      const sub = subs[i]!;
      const mem = memoize[i]!;

      if (p === mem) {
        continue next;
      }
      if (p < mem) {
        continue;
      }

      const found = s.indexOf(sub, p);
      if (found === p) {
        continue next;
      }
      memoize[i] = Math.max(mem, found);
    }
    return p;
  }
  return -1;
}

/**
 * Returns the position of the last non-occurance of any substrings. Returns -1
 * if any of the substrings are found, or unable to search. Only UTF-16 code
 * unit aware.
 *
 * @param start Start position of the search. Defaults to string end.
 */
export function lastIndexOfNone(s: string, subs: string[], start?: number) {
  if (subs.includes('')) {
    return -1;
  }
  start = Math.min(s.length - 1, Math.trunc(start ?? s.length - 1));

  const memoize: number[] = new Array(subs.length).fill(s.length);
  next: for (let p = start; p >= 0; --p) {
    for (let i = 0; i < subs.length; ++i) {
      const sub = subs[i]!;
      const mem = memoize[i]!;

      if (p === mem) {
        continue next;
      }
      if (p > mem) {
        continue;
      }

      const found = s.lastIndexOf(sub, p);
      if (found === p) {
        continue next;
      }
      memoize[i] = Math.min(mem, found);
    }
    return p;
  }
  return -1;
}

/**
 * Returns true if substring appear. Otherwise, returns false. Only UTF-16 code
 * unit aware.
 *
 * @param start Start position of the search. Defaults to string start.
 */
export function includes(s: string, sub: string, start?: number) {
  return s.includes(sub, start);
}

/**
 * Returns true if non-substring appear. Otherwise, returns false. Only UTF-16
 * code unit aware.
 *
 * @param start Start position of the search. Defaults to string start.
 */
export function includesNot(s: string, sub: string, start?: number) {
  return indexNotOf(s, sub, start) >= 0;
}

/**
 * Returns true if any of the substrings appear. Otherwise, returns false. Only
 * UTF-16 code unit aware.
 *
 * @param start Start position of the search. Defaults to string start.
 */
export function includesAny(s: string, subs: string[], start?: number) {
  return indexOfAny(s, subs, start) >= 0;
}

/**
 * Returns true if non-occurance of any of the substrings appear. Otherwise,
 * returns false. Only UTF-16 code unit aware.
 *
 * @param start Start position of the search. Defaults to string start.
 */
export function includesNone(s: string, subs: string[], start?: number) {
  return indexOfNone(s, subs, start) >= 0;
}
