/**
 * @copyright Romain Bertrand 2018
 * @copyright Akiomi Kamakura 2023
 */

import type { ExpectationResult } from '@vitest/expect';

import { deriveToReceiveMessage } from '../derivers';
import { formatComparison, matcherHint } from '../matcherUtils';

const toReceiveMessage = deriveToReceiveMessage('toReceiveMessage', function (received, expected): ExpectationResult {
  const pass = this.equals(received, expected);

  const message = pass
    ? () =>
        formatComparison.call(
          this,
          matcherHint('toReceiveMessage', true),
          'Expected the next received message to not equal:',
          expected,
          'Received:',
          received
        )
    : () =>
        formatComparison.call(
          this,
          matcherHint('toReceiveMessage'),
          'Expected the next received message to equal:',
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
});

export default toReceiveMessage;
