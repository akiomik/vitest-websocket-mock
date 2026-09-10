/**
 * @copyright Romain Bertrand 2018
 * @copyright Akiomi Kamakura 2023
 */

import type { ReceiveMessageOptions } from '../derivers';
import type { DeserializedMessage } from '../websocket';
import toHaveReceivedMessages from './toHaveReceivedMessages';
import toReceiveMessage from './toReceiveMessage';

export { toHaveReceivedMessages, toReceiveMessage };

export interface CustomMatchers<R = unknown> {
  // `R` is already `Promise<void>` in the promisified flavours (`.resolves`,
  // `.rejects`, `expect.poll`), so async matchers return a hard `Promise<void>`.
  toReceiveMessage<TMessage = object>(message: DeserializedMessage<TMessage>, options?: ReceiveMessageOptions): Promise<void>;
  toHaveReceivedMessages<TMessage = object>(messages: Array<DeserializedMessage<TMessage>>): R;
}
