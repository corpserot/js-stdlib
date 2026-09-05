import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  reverse,
  indexOf,
  lastIndexOf,
  indexNotOf,
  lastIndexNotOf,
  indexOfAny,
  lastIndexOfAny,
  indexOfNone,
  lastIndexOfNone,
  includes,
  includesNot,
  includesAny,
  includesNone,
} from '#str/index';

describe('str.reverse()', () => {
  it('should return an empty string for empty input', () => {
    assert.equal(reverse(''), '');
  });

  it('should return a single character unchanged', () => {
    assert.equal(reverse('a'), 'a');
  });

  it('should reverse a simple ASCII string', () => {
    assert.equal(reverse('abc'), 'cba');
    assert.equal(reverse('ab'), 'ba');
  });

  it('should leave a palindrome unchanged', () => {
    assert.equal(reverse('tacocat'), 'tacocat');
  });

  it('should handle Unicode code points', () => {
    assert.equal(reverse('café'), 'éfac');
  });

  it('should handle surrogate pairs', () => {
    // '𠮟' is a single code point (U+20B9F) encoded as a surrogate pair.
    assert.equal(reverse('𠮟'), '𠮟');
    assert.equal(reverse('a𠮟b'), 'b𠮟a');
    assert.equal(reverse('x𠮟y'), 'y𠮟x');
  });

  it('should differ from a UTF-16 code unit reversal for astral characters', () => {
    const codeUnitReversed = 'x𠮟y'.split('').reverse().join('');
    assert.equal(codeUnitReversed, 'y\uDF9F\uD842x');
    assert.equal(reverse('x𠮟y'), 'y𠮟x');
    assert.notEqual(reverse('x𠮟y'), codeUnitReversed);
    assert.equal(reverse('x𠮟y').length, 4);
  });

  it('should not handle graphemes (intentional)', () => {
    assert.equal(reverse('👨‍👩‍👦'), '👦‍👩‍👨');
  });

  it('should not handle combining characters (intentional)', () => {
    const input = 'e\u0301';
    assert.equal(reverse(input), '\u0301e');
  });

  it('should keep lone surrogates intact instead of crashing', () => {
    assert.equal(reverse('a\uD800b'), 'b\uD800a');
    assert.equal(reverse('\uD800\uD800'), '\uD800\uD800');
  });

  it('should be an involution for arbitrary inputs', () => {
    const inputs = ['', 'a', 'abc', 'café', 'x𠮟y', 'a\uD800b', 'e\u0301'];
    for (const input of inputs) {
      assert.equal(reverse(reverse(input)), input);
    }
  });

  it('should handle long strings without significant performance issues', () => {
    const long = 'a'.repeat(10000) + 'b';
    const reversed = reverse(long);
    assert.equal(reversed[0], 'b');
    assert.equal(reversed[reversed.length - 1], 'a');
    assert.equal(reversed.slice(1), 'a'.repeat(10000));
  });
});

describe('str.indexOf()', () => {
  it('should return the position of the first occurrence of the substring', () => {
    assert.equal(indexOf('hello world', 'world'), 6);
    assert.equal(indexOf('abab', 'ab'), 0);
    assert.equal(indexOf('abab', 'ab', 1), 2);
  });

  it('should return -1 when the substring is not found', () => {
    assert.equal(indexOf('hello world', 'x'), -1);
    assert.equal(indexOf('abc', 'abcd'), -1);
    assert.equal(indexOf('abc', 'abd'), -1);
  });

  it('should return -1 for an empty input string', () => {
    assert.equal(indexOf('', 'a'), -1);
    assert.equal(indexOf('', 'a', 5), -1);
  });

  it('should find an empty substring at the start, like the native method', () => {
    assert.equal(indexOf('abc', ''), 0);
    assert.equal(indexOf('', ''), 0);
    assert.equal(indexOf('abc', '', 1), 1);
    assert.equal(indexOf('abc', '', -1), 0);
  });

  it('should respect the start position', () => {
    assert.equal(indexOf('hello world', 'o', 0), 4);
    assert.equal(indexOf('hello world', 'o', 5), 7);
  });

  it('should return -1 when start is beyond the input string', () => {
    assert.equal(indexOf('abc', 'b', 3), -1);
    assert.equal(indexOf('abc', 'b', 99), -1);
  });

  it('should clamp a negative start to 0', () => {
    assert.equal(indexOf('abc', 'b', -1), 1);
  });

  it('should truncate a fractional start toward zero', () => {
    assert.equal(indexOf('abc', 'b', 1.9), 1);
  });

  it('should treat a NaN start as 0', () => {
    assert.equal(indexOf('abc', 'b', NaN), 1);
  });

  it('should default start to 0 when it is undefined', () => {
    assert.equal(indexOf('hello world', 'o', undefined), 4);
  });
});

describe('str.lastIndexOf()', () => {
  it('should return the position of the last occurrence of the substring', () => {
    assert.equal(lastIndexOf('hello world', 'o'), 7);
    assert.equal(lastIndexOf('hello world', 'l'), 9);
    assert.equal(lastIndexOf('abab', 'ab'), 2);
  });

  it('should return -1 when the substring is not found', () => {
    assert.equal(lastIndexOf('hello world', 'x'), -1);
    assert.equal(lastIndexOf('abc', 'abcd'), -1);
  });

  it('should return -1 for an empty input string', () => {
    assert.equal(lastIndexOf('', 'a'), -1);
  });

  it('should find an empty substring at the end, like the native method', () => {
    assert.equal(lastIndexOf('abc', ''), 3);
    assert.equal(lastIndexOf('', ''), 0);
    assert.equal(lastIndexOf('abc', '', 2), 2);
    assert.equal(lastIndexOf('abc', '', 0), 0);
  });

  it('should respect the start position', () => {
    assert.equal(lastIndexOf('hello world', 'o', 10), 7);
    assert.equal(lastIndexOf('hello world', 'o', 6), 4);
    assert.equal(lastIndexOf('hello world', 'o', 4), 4);
  });

  it('should clamp a start beyond the input string to the string end', () => {
    assert.equal(lastIndexOf('abc', 'c', 99), 2);
    assert.equal(lastIndexOf('abc', 'a', 99), 0);
  });

  it('should restrict the search when start is negative', () => {
    assert.equal(lastIndexOf('abc', 'a', -1), 0);
    assert.equal(lastIndexOf('abc', 'b', -1), -1);
    assert.equal(lastIndexOf('abc', 'c', -1), -1);
  });

  it('should truncate a fractional start toward zero', () => {
    assert.equal(lastIndexOf('abc', 'b', 1.9), 1);
    assert.equal(lastIndexOf('abc', 'a', 1.9), 0);
  });

  it('should search the whole string when start is NaN', () => {
    assert.equal(lastIndexOf('abc', 'c', NaN), 2);
    assert.equal(lastIndexOf('abc', 'a', NaN), 0);
  });

  it('should default start to the string end when it is undefined', () => {
    assert.equal(lastIndexOf('hello world', 'o', undefined), 7);
  });
});

describe('str.indexNotOf()', () => {
  it('should return 0 when both s and sub are empty', () => {
    assert.equal(indexNotOf('', ''), 0);
  });

  it('should return -1 for an empty input string', () => {
    assert.equal(indexNotOf('', 'a'), -1);
    assert.equal(indexNotOf('', 'ab'), -1);
  });

  it('should return -1 for an empty input string from given start', () => {
    assert.equal(indexNotOf('', 'a', 5), -1);
  });

  it('should return -1 when an empty substring regardless of input', () => {
    assert.equal(indexNotOf('abcde', ''), -1);
  });

  it('should return -1 when a single-char substring occurs at every position', () => {
    assert.equal(indexNotOf('a', 'a'), -1);
    assert.equal(indexNotOf('aaaaa', 'a'), -1);
  });

  it('should return -1 when a multi-char substring occurs at every position', () => {
    assert.equal(indexNotOf('ab', 'ab'), -1);
    assert.equal(indexNotOf('aaaa', 'aa'), -1);
  });

  it('should return -1 when a substring occurs at every position from the given start', () => {
    assert.equal(indexNotOf('abc', 'bc', 1), -1);
    assert.equal(indexNotOf('aaaa', 'aa', 2), -1);
    assert.equal(indexNotOf('aaaaa.aaaa', 'a', 6), -1);
    assert.equal(indexNotOf('aaaaa.aaaa', 'a', 8), -1);
    assert.equal(indexNotOf('aaaaa.aaaa', 'a', 9), -1);
  });

  it('should return -1 when a substring occurs at every position from the given start clamped to 0', () => {
    assert.equal(indexNotOf('aaaa', 'a', -3), -1);
  });

  it('should return -1 when the given start is beyond the input string', () => {
    assert.equal(indexNotOf('aaaaa.aaaa', 'a', 10), -1);
    assert.equal(indexNotOf('aaaaa.aaaa', 'a', 11), -1);
    assert.equal(indexNotOf('aaaaa.aaaa', 'a', 99), -1);
  });

  it('should correctly report mismatch position when the single-char substring does not occur at all', () => {
    assert.equal(indexNotOf('abcde', 'z'), 0);
    assert.equal(indexNotOf('aaaaa', 'b'), 0);
  });

  it('should correctly report mismatch position despite the single-char substring occurs elsewhere', () => {
    assert.equal(indexNotOf('ab', 'a'), 1);
    assert.equal(indexNotOf('ab', 'b'), 0);
    assert.equal(indexNotOf('abcde', 'a'), 1);
    assert.equal(indexNotOf('abcde', 'b'), 0);
    assert.equal(indexNotOf('abcde', 'c'), 0);
    assert.equal(indexNotOf('abcde', 'd'), 0);
    assert.equal(indexNotOf('abcde', 'e'), 0);
    assert.equal(indexNotOf('aa.aa', 'a'), 2);
    assert.equal(indexNotOf('aaaaa.aaaa', 'a'), 5);
  });

  it('should correctly report mismatch position from the given start despite the single-char substring occurs elsewhere', () => {
    assert.equal(indexNotOf('aaaaa.aaaa', 'a', 1), 5);
    assert.equal(indexNotOf('aaaaa.aaaa', 'a', 4), 5);
    assert.equal(indexNotOf('aaaaa.aaaa', 'a', 5), 5);
  });

  it('should correctly report mismatch position from the given start clamped to 0 despite the single-char substring occurs elsewhere', () => {
    assert.equal(indexNotOf('abcde', 'a', -5), 1);
    assert.equal(indexNotOf('abcde', 'b', -1), 0);
  });

  it('should correctly report mismatch position when the multi-char substring does not occur at all', () => {
    assert.equal(indexNotOf('a.', 'ab'), 0);
    assert.equal(indexNotOf('bcde', 'ab'), 0);
  });

  it('should correctly report mismatch position despite the multi-char substring occurs elsewhere', () => {
    assert.equal(indexNotOf('abcde', 'ab'), 1);
    assert.equal(indexNotOf('abcde', 'bc'), 0);
    assert.equal(indexNotOf('abcde', 'cde'), 0);
    assert.equal(indexNotOf('abab.abab', 'ab'), 1);
    assert.equal(indexNotOf('ababab', 'ab'), 1);
  });

  it('should correctly report mismatch position from the given start despite the multi-char substring occurs elsewhere', () => {
    assert.equal(indexNotOf('abxab', 'ab', 2), 2);
    assert.equal(indexNotOf('aaaa', 'aa', 3), 3);
  });

  it('should correctly report mismatch position 0 when the substring is longer than the input string', () => {
    assert.equal(indexNotOf('a', 'ab'), 0);
    assert.equal(indexNotOf('a', 'abc'), 0);
    assert.equal(indexNotOf('ab', 'abc'), 0);
    assert.equal(indexNotOf('ab', 'abcd'), 0);
    assert.equal(indexNotOf('abc', 'abcd'), 0);
  });

  it('should default start to 0 when it is undefined', () => {
    assert.equal(indexNotOf('abcde', 'a', undefined), 1);
  });

  it('should truncate a fractional start toward zero before searching', () => {
    assert.equal(indexNotOf('aaaaa.aaaa', 'a', 3.99), 5);
    assert.equal(indexNotOf('aaaaa.aaaa', 'a', 5.5), 5);
  });

  it('should clamp a fractional negative start to 0', () => {
    assert.equal(indexNotOf('aaaaa.aaaa', 'a', -2.7), 5);
  });

  it('should return -1 when start is NaN', () => {
    assert.equal(indexNotOf('abc', 'c', NaN), -1);
    assert.equal(indexNotOf('abcde', 'a', NaN), -1);
  });
});

describe('str.lastIndexNotOf()', () => {
  it('should return 0 when both s and sub are empty', () => {
    assert.equal(lastIndexNotOf('', ''), 0);
    assert.equal(lastIndexNotOf('', '', 0), 0);
    assert.equal(lastIndexNotOf('', '', -1), 0);
  });

  it('should return -1 if sub is empty', () => {
    assert.equal(lastIndexNotOf('abc', ''), -1);
  });

  it('should return -1 if s is empty', () => {
    assert.equal(lastIndexNotOf('', 'a'), -1);
    assert.equal(lastIndexNotOf('', 'ab'), -1);
  });

  it('should return -1 if sub is longer than s', () => {
    assert.equal(lastIndexNotOf('abc', 'abcd'), -1);
    assert.equal(lastIndexNotOf('ab', 'abc'), -1);
    assert.equal(lastIndexNotOf('a', 'ab'), -1);
    assert.equal(lastIndexNotOf('abc', 'abcd', 5), -1);
  });

  it('should return 0 when sub has the same length as s but does not match', () => {
    assert.equal(lastIndexNotOf('abc', 'abd'), 0);
  });

  it('should return -1 if sub matches at every valid position from 0 to s.length - sub.length', () => {
    assert.equal(lastIndexNotOf('aaaaa', 'a'), -1);
    assert.equal(lastIndexNotOf('aaa', 'aa'), -1);
    assert.equal(lastIndexNotOf('aa', 'aa'), -1);
  });

  it('should return the last position where sub does NOT match', () => {
    assert.equal(lastIndexNotOf('baaaa', 'a'), 0);
    assert.equal(lastIndexNotOf('abc', 'c'), 1);
    assert.equal(lastIndexNotOf('abc', 'a'), 2);
    assert.equal(lastIndexNotOf('abca', 'a'), 2);
    assert.equal(lastIndexNotOf('aaab', 'ab'), 1);
  });

  it('should return the last valid position when sub does not occur at all', () => {
    assert.equal(lastIndexNotOf('abcde', 'z'), 4);
  });

  it('should return 0 if only position 0 fails the match', () => {
    assert.equal(lastIndexNotOf('abc', 'bc'), 0);
  });

  it('should return the index of the last non-matching position when a suffix matches', () => {
    assert.equal(lastIndexNotOf('xabc', 'abc'), 0);
  });

  it('should work with multi-code-point substrings', () => {
    assert.equal(lastIndexNotOf('ééé', 'é'), -1);
    assert.equal(lastIndexNotOf('aéé', 'é'), 0);
    assert.equal(lastIndexNotOf('abab', 'ab'), 1);
  });

  it('should search only within [0, start]', () => {
    assert.equal(lastIndexNotOf('aaabaa', 'a', 5), 3);
    assert.equal(lastIndexNotOf('abc', 'b', 1), 0);
    assert.equal(lastIndexNotOf('abc', 'c', 0), 0);
  });

  it('should return -1 if all positions from 0 to start match', () => {
    assert.equal(lastIndexNotOf('aaabaa', 'a', 2), -1);
    assert.equal(lastIndexNotOf('abc', 'a', 0), -1);
  });

  it('should clamp start to s.length - sub.length if start is too large', () => {
    assert.equal(lastIndexNotOf('abc', 'c', 10), 1);
    assert.equal(lastIndexNotOf('abc', 'c', 2), 1);
    assert.equal(lastIndexNotOf('abc', 'ab', 99), 1);
    assert.equal(lastIndexNotOf('abcde', 'de', 99), 2);
  });

  it('should return -1 if start is negative', () => {
    assert.equal(lastIndexNotOf('abc', 'c', -5), -1);
    assert.equal(lastIndexNotOf('abc', 'a', -1), -1);
  });

  it('should return -1 when start is NaN', () => {
    assert.equal(lastIndexNotOf('abc', 'a', NaN), -1);
    assert.equal(lastIndexNotOf('abc', 'c', NaN), -1);
  });

  it('should truncate a fractional start toward zero before searching', () => {
    assert.equal(lastIndexNotOf('aaaaa.aaaa', 'a', 5.5), 5);
    assert.equal(lastIndexNotOf('aaaaa.aaaa', 'a', 3.99), -1);
  });

  it('should return -1 for a fractional negative start', () => {
    // Unlike indexNotOf(), a negative start is not clamped to 0.
    assert.equal(lastIndexNotOf('aaaaa.aaaa', 'a', -2.7), -1);
  });

  it('should default start to s.length - sub.length when it is undefined', () => {
    assert.equal(lastIndexNotOf('abc', 'a'), 2);
    assert.equal(lastIndexNotOf('abc', 'a', undefined), 2);
  });

  it('should work when sub matches the suffix at start', () => {
    assert.equal(lastIndexNotOf('abc', 'bc', 1), 0);
  });

  it('should work when sub does not match at the clamped start', () => {
    assert.equal(lastIndexNotOf('abc', 'c', 2), 1);
  });
});

describe('str.indexOfAny()', () => {
  it('should return the earliest index among all found substrings', () => {
    assert.equal(indexOfAny('hello world', ['o', 'w']), 4);
    assert.equal(indexOfAny('hello world', ['world']), 6);
    assert.equal(indexOfAny('abc', ['c', 'bc']), 1);
  });

  it('should prefer the occurrence that starts earliest, even if another substring is longer', () => {
    assert.equal(indexOfAny('ababa', ['aba', 'bab']), 0);
  });

  it('should return -1 when none of the substrings are found', () => {
    assert.equal(indexOfAny('hello world', ['x', 'y']), -1);
    assert.equal(indexOfAny('abc', ['abcd']), -1);
  });

  it('should return -1 for an empty subs list', () => {
    assert.equal(indexOfAny('hello world', []), -1);
    assert.equal(indexOfAny('', []), -1);
  });

  it('should return 0 when subs contains an empty string, regardless of start', () => {
    assert.equal(indexOfAny('hello world', ['']), 0);
    assert.equal(indexOfAny('hello world', [''], 5), 0);
    assert.equal(indexOfAny('', ['']), 0);
  });

  it('should handle empty s', () => {
    assert.equal(indexOfAny('', ['a']), -1);
    assert.equal(indexOfAny('', ['']), 0);
  });

  it('should respect the start position', () => {
    assert.equal(indexOfAny('hello world', ['o', 'w'], 5), 6);
    assert.equal(indexOfAny('hello world', ['o', 'w'], 8), -1);
    assert.equal(indexOfAny('xabc', ['abc'], 0), 1);
  });

  it('should return -1 when start is beyond the input string', () => {
    assert.equal(indexOfAny('ab', ['c', 'd'], 99), -1);
  });

  it('should clamp a negative start to 0', () => {
    assert.equal(indexOfAny('abc', ['b'], -1), 1);
    assert.equal(indexOfAny('abc', ['b', 'c'], -5), 1);
  });

  it('should truncate a fractional start toward zero', () => {
    assert.equal(indexOfAny('abc', ['b'], 1.9), 1);
  });

  it('should treat a NaN start as 0', () => {
    assert.equal(indexOfAny('abc', ['b', 'c'], NaN), 1);
  });

  it('should tolerate duplicate substrings', () => {
    assert.equal(indexOfAny('abc', ['a', 'a']), 0);
  });
});

describe('str.lastIndexOfAny()', () => {
  it('should return the latest index among all found substrings', () => {
    assert.equal(lastIndexOfAny('hello world', ['o', 'l']), 9);
    assert.equal(lastIndexOfAny('hello world', ['o']), 7);
    assert.equal(lastIndexOfAny('abab', ['ab']), 2);
  });

  it('should prefer the occurrence that starts latest, even if another substring is shorter', () => {
    assert.equal(lastIndexOfAny('ababa', ['aba', 'bab']), 2);
  });

  it('should return -1 when none of the substrings are found', () => {
    assert.equal(lastIndexOfAny('hello world', ['x']), -1);
    assert.equal(lastIndexOfAny('abc', ['abcd']), -1);
  });

  it('should return -1 for an empty subs list', () => {
    assert.equal(lastIndexOfAny('hello world', []), -1);
    assert.equal(lastIndexOfAny('', []), -1);
  });

  it('should return -1 when subs contains an empty string (unlike indexOfAny)', () => {
    assert.equal(lastIndexOfAny('hello world', ['']), -1);
    assert.equal(lastIndexOfAny('hello world', [''], 6), -1);
    assert.equal(lastIndexOfAny('', ['']), -1);
  });

  it('should handle empty s', () => {
    assert.equal(lastIndexOfAny('', ['a']), -1);
  });

  it('should respect the start position', () => {
    assert.equal(lastIndexOfAny('hello world', ['o', 'l'], 6), 4);
    assert.equal(lastIndexOfAny('hello world', ['o'], 4), 4);
    assert.equal(lastIndexOfAny('xabc', ['abc'], 1), 1);
  });

  it('should clamp a start beyond the input string to the string end', () => {
    assert.equal(lastIndexOfAny('abc', ['b'], 99), 1);
    assert.equal(lastIndexOfAny('abc', ['a', 'c'], 99), 2);
  });

  it('should restrict the search when start is negative', () => {
    assert.equal(lastIndexOfAny('abc', ['a'], -1), 0);
    assert.equal(lastIndexOfAny('abc', ['a', 'c'], -5), 0);
    assert.equal(lastIndexOfAny('abc', ['b', 'c'], -1), -1);
  });

  it('should truncate a fractional start toward zero', () => {
    assert.equal(lastIndexOfAny('abc', ['b', 'c'], 1.9), 1);
  });

  it('should search the whole string when start is NaN', () => {
    assert.equal(lastIndexOfAny('abc', ['a'], NaN), 0);
    assert.equal(lastIndexOfAny('abc', ['c'], NaN), 2);
  });

  it('should tolerate duplicate substrings', () => {
    assert.equal(lastIndexOfAny('abc', ['a', 'a']), 0);
  });
});

describe('str.indexOfNone()', () => {
  it('should return the first position that is not covered by any substring', () => {
    assert.equal(indexOfNone('abcde', ['a']), 1);
    assert.equal(indexOfNone('abcde', ['a', 'b']), 2);
    assert.equal(indexOfNone('aalaa', ['a']), 2);
    assert.equal(indexOfNone('abab', ['ab']), 1);
  });

  it('should find the first free position even when some substrings still occur later', () => {
    assert.equal(indexOfNone('abc', ['ab', 'c']), 1);
  });

  it('should return -1 when every position is covered by some substring', () => {
    assert.equal(indexOfNone('aaaa', ['a']), -1);
    assert.equal(indexOfNone('abcx', ['abc']), -1);
    assert.equal(indexOfNone('abc', ['a', 'b', 'c']), -1);
    assert.equal(indexOfNone('abc', ['a', 'bc']), -1);
    assert.equal(indexOfNone('ab', ['a', 'b']), -1);
    assert.equal(indexOfNone('aaa', ['a', 'aa']), -1);
  });

  it('should return 0 when nothing matches at position 0', () => {
    assert.equal(indexOfNone('aaaa', ['b']), 0);
    assert.equal(indexOfNone('xabc', ['abc']), 0);
    assert.equal(indexOfNone('abc', ['x', 'y']), 0);
    assert.equal(indexOfNone('abcde', ['e']), 0);
    assert.equal(indexOfNone('abcde', ['d', 'e']), 0);
    assert.equal(indexOfNone('zzabc', ['abc']), 0);
    assert.equal(indexOfNone('abc', ['bc']), 0);
  });

  it('should be unreachable when a substring is longer than the remaining string', () => {
    assert.equal(indexOfNone('ab', ['abc']), -1);
    assert.equal(indexOfNone('abc', ['abcd']), -1);
  });

  it('should respect the start position', () => {
    assert.equal(indexOfNone('abcde', ['a'], 2), 2);
    assert.equal(indexOfNone('abcde', ['a'], 5), -1);
    assert.equal(indexOfNone('abcde', ['a'], -3), 1);
    assert.equal(indexOfNone('abc', ['b'], 1), -1);
  });

  it('should return -1 when every reachable position from the start is covered', () => {
    assert.equal(indexOfNone('aaaaa.aaaa', ['a'], 6), -1);
  });

  it('should return -1 when subs contains an empty string', () => {
    assert.equal(indexOfNone('abc', ['']), -1);
    assert.equal(indexOfNone('', ['']), -1);
  });

  it('should return -1 for an empty subs list', () => {
    assert.equal(indexOfNone('abc', []), -1);
    assert.equal(indexOfNone('', []), -1);
  });

  it('should return -1 for empty s', () => {
    assert.equal(indexOfNone('', ['a']), -1);
  });

  it('should truncate a fractional start toward zero before searching', () => {
    assert.equal(indexOfNone('abcde', ['a'], 3.99), 3);
  });

  it('should clamp a fractional negative start to 0', () => {
    assert.equal(indexOfNone('aaaaa.aaaa', ['a'], -2.7), 5);
  });

  it('should return -1 when start is NaN', () => {
    assert.equal(indexOfNone('abcde', ['a'], NaN), -1);
    assert.equal(indexOfNone('abc', ['a', 'b'], NaN), -1);
  });

  it('should tolerate duplicate substrings', () => {
    assert.equal(indexOfNone('aaaaa.aaaa', ['a', 'a', 'a']), 5);
  });
});

describe('str.lastIndexOfNone()', () => {
  it('should return the last position that is not covered by any substring', () => {
    assert.equal(lastIndexOfNone('abcde', ['a']), 4);
    assert.equal(lastIndexOfNone('abcde', ['a', 'b']), 4);
    assert.equal(lastIndexOfNone('abab', ['ab']), 3);
    assert.equal(lastIndexOfNone('abc', ['bc']), 2);
  });

  it('should return -1 when every position is covered by some substring', () => {
    assert.equal(lastIndexOfNone('aaaa', ['a']), -1);
    assert.equal(lastIndexOfNone('abc', ['a', 'b', 'c']), -1);
    assert.equal(lastIndexOfNone('aaaa', ['a', 'a']), -1);
    assert.equal(lastIndexOfNone('abc', ['a', 'c'], 0), -1);
  });

  it('should respect the start position', () => {
    assert.equal(lastIndexOfNone('abcde', ['a'], 3), 3);
    assert.equal(lastIndexOfNone('abcde', ['b'], 0), 0);
    assert.equal(lastIndexOfNone('abc', ['b'], 1), 0);
    assert.equal(lastIndexOfNone('abcde', ['b', 'c'], 2), 0);
  });

  it('should return -1 when start is 0 and the only position matches', () => {
    assert.equal(lastIndexOfNone('abcde', ['a'], 0), -1);
    assert.equal(lastIndexOfNone('a', ['a'], 0), -1);
  });

  it('should report a leftover trailing position when a prefix substring covers it', () => {
    assert.equal(lastIndexOfNone('abcx', ['abc']), 3);
  });

  it('should clamp start to s.length - 1 when start is too large', () => {
    assert.equal(lastIndexOfNone('abc', ['b'], 99), 2);
    assert.equal(lastIndexOfNone('abc', ['c'], 10), 1);
  });

  it('should return -1 when start is negative', () => {
    assert.equal(lastIndexOfNone('abc', ['a'], -5), -1);
    assert.equal(lastIndexOfNone('abc', [], -1), -1);
  });

  it('should return -1 when start is NaN', () => {
    assert.equal(lastIndexOfNone('abc', ['x'], NaN), -1);
    assert.equal(lastIndexOfNone('abc', [], NaN), -1);
  });

  it('should truncate a fractional start toward zero', () => {
    assert.equal(lastIndexOfNone('abc', ['a'], 1.9), 1);
  });

  it('should return -1 when subs contains an empty string', () => {
    assert.equal(lastIndexOfNone('abc', ['']), -1);
    assert.equal(lastIndexOfNone('', ['']), -1);
  });

  it('should return the last position for an empty subs list', () => {
    assert.equal(lastIndexOfNone('abc', []), 2);
    assert.equal(lastIndexOfNone('abc', [], 1), 1);
  });

  it('should return -1 for empty s', () => {
    assert.equal(lastIndexOfNone('', ['a']), -1);
    assert.equal(lastIndexOfNone('', [], 0), -1);
  });

  it('should tolerate a substring longer than s', () => {
    assert.equal(lastIndexOfNone('abc', ['abcd']), 2);
    assert.equal(lastIndexOfNone('ab', ['abc']), 1);
  });

  it('should tolerate duplicate substrings', () => {
    assert.equal(lastIndexOfNone('abc', ['a', 'a']), 2);
  });
});

describe('str.includes()', () => {
  it('should return true when the substring appears', () => {
    assert.equal(includes('hello', 'ell'), true);
    assert.equal(includes('hello', 'l', 3), true);
    assert.equal(includes('abc', 'ab', 0), true);
  });

  it('should return false when the substring does not appear', () => {
    assert.equal(includes('hello', 'x'), false);
    assert.equal(includes('hello', 'l', 4), false);
    assert.equal(includes('abc', 'ab', 1), false);
    assert.equal(includes('abc', 'b', 3), false);
  });

  it('should return true for an empty substring', () => {
    assert.equal(includes('abc', ''), true);
    assert.equal(includes('abc', '', 3), true);
    assert.equal(includes('', ''), true);
  });

  it('should return false for an empty input string', () => {
    assert.equal(includes('', 'a'), false);
  });

  it('should clamp a negative start to 0', () => {
    assert.equal(includes('abc', 'b', -1), true);
  });

  it('should truncate a fractional start toward zero', () => {
    assert.equal(includes('abc', 'b', 1.9), true);
  });

  it('should treat a NaN start as 0', () => {
    assert.equal(includes('abc', 'b', NaN), true);
  });

  it('should default start to 0 when it is undefined', () => {
    assert.equal(includes('hello', 'l', undefined), true);
  });
});

describe('str.includesNot()', () => {
  it('should return true when a non-matching position exists', () => {
    assert.equal(includesNot('abcde', 'a'), true);
    assert.equal(includesNot('abcde', 'z'), true);
    assert.equal(includesNot('abc', 'ab'), true);
  });

  it('should return false when the substring covers every position', () => {
    assert.equal(includesNot('aaaa', 'a'), false);
    assert.equal(includesNot('aaaa', 'aa'), false);
  });

  it('should mirror indexNotOf for the empty-string/empty-input cases', () => {
    assert.equal(includesNot('abc', ''), false);
    assert.equal(includesNot('', ''), true);
    assert.equal(includesNot('', 'a'), false);
  });

  it('should respect the start position', () => {
    assert.equal(includesNot('abcde', 'a', 2), true);
    assert.equal(includesNot('abcde', 'a'), true);
    assert.equal(includesNot('aaaaa.aaaa', 'a', 6), false);
  });
});

describe('str.includesAny()', () => {
  it('should return true when any substring appears', () => {
    assert.equal(includesAny('hello', ['x', 'ell']), true);
    assert.equal(includesAny('abc', ['c', 'bc']), true);
  });

  it('should return false when none of the substrings appear', () => {
    assert.equal(includesAny('hello', ['x', 'y']), false);
    assert.equal(includesAny('abc', ['abcd']), false);
  });

  it('should return true when subs contains an empty string', () => {
    assert.equal(includesAny('hello', ['']), true);
    assert.equal(includesAny('', ['']), true);
  });

  it('should return false for an empty subs list or empty s', () => {
    assert.equal(includesAny('abc', []), false);
    assert.equal(includesAny('', ['a']), false);
  });

  it('should respect the start position', () => {
    assert.equal(includesAny('hello world', ['o', 'w'], 5), true);
    assert.equal(includesAny('hello world', ['o', 'w'], 8), false);
  });

  it('should clamp a negative start to 0 and treat a NaN start as 0', () => {
    assert.equal(includesAny('abc', ['b'], -1), true);
    assert.equal(includesAny('abc', ['b'], NaN), true);
  });

  it('should return false when start is beyond the input string', () => {
    assert.equal(includesAny('abc', ['b'], 99), false);
  });
});

describe('str.includesNone()', () => {
  it('should return true when a position is free of every substring', () => {
    assert.equal(includesNone('hello', ['x', 'y']), true);
    assert.equal(includesNone('abcde', ['e']), true);
    assert.equal(includesNone('abab', ['ab']), true);
  });

  it('should return false when every position is covered by some substring', () => {
    assert.equal(includesNone('aaaa', ['a']), false);
    assert.equal(includesNone('abc', ['a', 'bc']), false);
  });

  it('should return false when subs contains an empty string', () => {
    assert.equal(includesNone('abc', ['']), false);
    assert.equal(includesNone('', ['']), false);
  });

  it('should return false for an empty subs list or empty s', () => {
    assert.equal(includesNone('abc', []), false);
    assert.equal(includesNone('', ['a']), false);
  });

  it('should respect the start position', () => {
    assert.equal(includesNone('abcde', ['a'], 2), true);
    assert.equal(includesNone('abcde', ['a'], 5), false);
  });
});
