/**
 * @copyright Romain Bertrand 2018
 * @copyright Akiomi Kamakura 2023
 */

import type { ExpectationResult } from '@vitest/expect';

import { deriveToHaveReceivedMessage } from '../derivers';
import matcherHint from '../matcherHint';
import type { DeserializedMessage } from '../websocket';

const toHaveReceivedMessages = deriveToHaveReceivedMessage(
  'toHaveReceivedMessages',
  function (received: Array<DeserializedMessage>, expected: Array<DeserializedMessage>): ExpectationResult {
    const equalities = expected.map((expectedMsg) =>
      // object comparison to handle JSON protocols
      received.some((receivedMsg) => this.equals(receivedMsg, expectedMsg))
    );
    const pass = this.isNot ? equalities.some(Boolean) : equalities.every(Boolean);

    const message = pass
      ? () =>
          matcherHint('.not.toHaveReceivedMessages') +
          '\n\n' +
          `Expected the WS server to not have received the following messages:\n` +
          `  ${this.utils.stringify(expected)}\n` +
          `But it received:\n` +
          `  ${this.utils.stringify(received)}`
      : () => {
          return (
            matcherHint('.toHaveReceivedMessages') +
            '\n\n' +
            `Expected the WS server to have received the following messages:\n` +
            `  ${this.utils.stringify(expected)}\n` +
            `Received:\n` +
            `  ${this.utils.stringify(received)}\n\n`
          );
        };

    return {
      actual: received,
      expected,
      message,
      pass,
    };
  }
);

export default toHaveReceivedMessages;
