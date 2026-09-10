/**
 * @copyright Romain Bertrand 2018
 * @copyright Akiomi Kamakura 2023
 */

import type { MatcherResult } from 'vitest';

import { deriveToHaveReceivedMessage } from '../derivers';
import { formatComparison, matcherHint } from '../matcherUtils';
import type { DeserializedMessage } from '../websocket';

const toHaveReceivedMessages = deriveToHaveReceivedMessage(
  'toHaveReceivedMessages',
  function (received: Array<DeserializedMessage>, expected: Array<DeserializedMessage>): MatcherResult {
    const equalities = expected.map((expectedMsg) =>
      // object comparison to handle JSON protocols
      received.some((receivedMsg) => this.equals(receivedMsg, expectedMsg))
    );
    const pass = this.isNot ? equalities.some(Boolean) : equalities.every(Boolean);

    const message = pass
      ? () =>
          formatComparison.call(
            this,
            matcherHint('toHaveReceivedMessages', true),
            'Expected the WS server to not have received the following messages:',
            expected,
            'But it received:',
            received
          )
      : () =>
          formatComparison.call(
            this,
            matcherHint('toHaveReceivedMessages'),
            'Expected the WS server to have received the following messages:',
            expected,
            'Received:',
            received
          );

    return {
      actual: received,
      expected,
      message,
      pass,
    };
  }
);

export default toHaveReceivedMessages;
