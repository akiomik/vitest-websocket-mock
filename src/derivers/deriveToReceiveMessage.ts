/**
 * @copyright Romain Bertrand 2018
 * @copyright Akiomi Kamakura 2023
 */

import type { AsyncExpectationResult, RawMatcherFn } from '@vitest/expect';

import { matcherHint } from '../matcherUtils';
import type { DeserializedMessage } from '../websocket';
import WS from '../websocket';
import makeInvalidWsMessage from './makeInvalidWsMessage';
import type { ReceiveMessageOptions } from './types';

const WAIT_DELAY = 1000;
const TIMEOUT = Symbol('timeout');

export default function deriveToReceiveMessage(name: string, fn: RawMatcherFn): RawMatcherFn {
  return async function (ws: WS, expected: DeserializedMessage, options?: ReceiveMessageOptions): AsyncExpectationResult {
    const isWS = ws instanceof WS;
    if (!isWS) {
      return {
        pass: this.isNot, // always fail
        message: makeInvalidWsMessage.bind(this, ws, name),
      };
    }

    const waitDelay = options?.timeout ?? WAIT_DELAY;

    const messageOrTimeout = await Promise.race([
      ws.nextMessage,
      new Promise((resolve) => setTimeout(() => resolve(TIMEOUT), waitDelay)),
    ]);

    if (messageOrTimeout === TIMEOUT) {
      return {
        pass: this.isNot, // always fail
        message: () =>
          matcherHint(name, this.isNot) +
          '\n\n' +
          `Expected the websocket server to receive a message,\n` +
          `but it didn't receive anything in ${waitDelay}ms.`,
      };
    } else {
      const received = messageOrTimeout;
      return Promise.resolve(fn.call(this, received, expected, options));
    }
  };
}
