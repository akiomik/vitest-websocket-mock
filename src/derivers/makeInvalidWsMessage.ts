/**
 * @copyright Romain Bertrand 2018
 * @copyright Akiomi Kamakura 2023
 */

import type { MatcherState } from '@vitest/expect';

import type WS from '../websocket';

export default function makeInvalidWsMessage(this: MatcherState, ws: WS, matcher: string) {
  return (
    this.utils.matcherHint(this.isNot ? `.not.${matcher}` : `.${matcher}`, 'WS', 'expected') +
    '\n\n' +
    `Expected the websocket object to be a valid WS mock.\n` +
    `Received: ${typeof ws}\n` +
    `  ${this.utils.printReceived(ws)}`
  );
}
