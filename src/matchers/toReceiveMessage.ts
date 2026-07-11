/**
 * @copyright Romain Bertrand 2018
 * @copyright Akiomi Kamakura 2023
 */

import type { ExpectationResult } from '@vitest/expect';

import { deriveToReceiveMessage } from '../derivers';
import matcherHint from '../matcherHint';

const toReceiveMessage = deriveToReceiveMessage('toReceiveMessage', function (received, expected): ExpectationResult {
  const pass = this.equals(received, expected);

  const message = pass
    ? () =>
        matcherHint('.not.toReceiveMessage') +
        '\n\n' +
        `Expected the next received message to not equal:\n` +
        `  ${this.utils.stringify(expected)}\n` +
        `Received:\n` +
        `  ${this.utils.stringify(received)}`
    : () =>
        matcherHint('.toReceiveMessage') +
        '\n\n' +
        `Expected the next received message to equal:\n` +
        `  ${this.utils.stringify(expected)}\n` +
        `Received:\n` +
        `  ${this.utils.stringify(received)}`;

  return {
    actual: received,
    expected,
    message,
    pass,
  };
});

export default toReceiveMessage;
