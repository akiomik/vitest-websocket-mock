/**
 * @copyright Akiomi Kamakura 2026
 */

import type { MatcherState } from 'vitest';

/**
 * Plain-text replacements for `this.utils.matcherHint` / `printExpected` /
 * `printReceived`. Matcher messages must not contain ANSI color codes, so
 * that color detection (e.g. AI-agent environments) cannot make them differ
 * between environments; the reporter renders its own colored diff from the
 * `actual` / `expected` returned by matchers.
 */
export function matcherHint(matcher: string, isNot = false): string {
  return `expect(WS).${isNot ? 'not.' : ''}${matcher}(expected)`;
}

const SPACE_SYMBOL = '·';

// Like vitest's printExpected/printReceived, replace trailing spaces with
// middle dots so that editors stripping trailing whitespace cannot corrupt
// snapshotted messages.
function replaceTrailingSpaces(text: string): string {
  return text.replace(/\s+$/gm, (spaces) => SPACE_SYMBOL.repeat(spaces.length));
}

export function printValue(this: MatcherState, value: unknown): string {
  return replaceTrailingSpaces(this.utils.stringify(value));
}

export function formatComparison(
  this: MatcherState,
  hint: string,
  expectedLabel: string,
  expected: unknown,
  receivedLabel: string,
  received: unknown
): string {
  return (
    hint +
    '\n\n' +
    `${expectedLabel}\n` +
    `  ${printValue.call(this, expected)}\n` +
    `${receivedLabel}\n` +
    `  ${printValue.call(this, received)}`
  );
}
