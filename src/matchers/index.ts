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
  toReceiveMessage<TMessage = object>(message: DeserializedMessage<TMessage>, options?: ReceiveMessageOptions): Promise<R>;
  toHaveReceivedMessages<TMessage = object>(messages: Array<DeserializedMessage<TMessage>>): R;
}
