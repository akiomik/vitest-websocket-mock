/**
 * @copyright Romain Bertrand 2018
 * @copyright Akiomi Kamakura 2023
 */

import type { MatcherState } from 'vitest';

import { matcherHint, printValue } from '../matcherUtils';
import type WS from '../websocket';

export default function makeInvalidWsMessage(this: MatcherState, ws: WS, matcher: string) {
  return (
    matcherHint(matcher, this.isNot) +
    '\n\n' +
    `Expected the websocket object to be a valid WS mock.\n` +
    `Received: ${typeof ws}\n` +
    `  ${printValue.call(this, ws)}`
  );
}
