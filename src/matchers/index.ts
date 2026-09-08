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
  // `R` is vitest's assertion return type, which is already `Promise<void>` for
  // the promisified flavours (`.resolves`, `.rejects`, `expect.poll`). Wrapping
  // it again would declare `Promise<Promise<void>>` there, so async matchers
  // return a hard `Promise<void>`, the same way vitest declares its own.
  toReceiveMessage<TMessage = object>(message: DeserializedMessage<TMessage>, options?: ReceiveMessageOptions): Promise<void>;
  toHaveReceivedMessages<TMessage = object>(messages: Array<DeserializedMessage<TMessage>>): R;
}
