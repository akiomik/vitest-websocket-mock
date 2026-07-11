/**
 * @copyright Akiomi Kamakura 2026
 */

/**
 * A plain-text replacement for `this.utils.matcherHint`.
 * Matcher messages must not contain ANSI color codes, so that they are
 * environment-independent and safe to snapshot; the reporter renders its
 * own colored diff from the `actual` / `expected` returned by matchers.
 */
export default function matcherHint(matcher: string, received = 'WS', expected = 'expected'): string {
  return `expect(${received})${matcher}(${expected})`;
}
