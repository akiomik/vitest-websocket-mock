/**
 * @copyright Romain Bertrand 2018
 * @copyright Akiomi Kamakura 2023
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import WS from '../../websocket';
import deriveToReceiveMessage from '../deriveToReceiveMessage';

let server: WS, client: WebSocket;
beforeEach(async () => {
  server = new WS('ws://localhost:1234');
  client = new WebSocket('ws://localhost:1234');
  await server.connected;
});

afterEach(() => {
  WS.clean();
});

describe('A custom matcher `toReceiveHello` derived from toReceiveMessage', () => {
  expect.extend({
    toReceiveHello: deriveToReceiveMessage('toReceiveHello', (received) => {
      const pass = received === 'Hello';
      const message = pass
        ? () => `Expected the next received message is not Hello, but got ${received}`
        : () => `Expected the next received message is Hello, but got ${received}`;

      return {
        actual: received,
        expected: 'Hello',
        message,
        pass,
      };
    }),
  });

  it('passes when received "Hello"', async () => {
    client.send('Hello');
    // biome-ignore lint/suspicious/noExplicitAny: test helper casts to access matcher internals
    await (expect(server) as any).toReceiveHello();
  });

  it('fails when received "Hi!"', async () => {
    client.send('Hi!');
    // biome-ignore lint/suspicious/noExplicitAny: test helper casts to access matcher internals
    await expect((expect(server) as any).toReceiveHello()).rejects.toThrowErrorMatchingInlineSnapshot(
      '[Error: Expected the next received message is Hello, but got Hi!]'
    );
  });

  it('fails when received "Hello" under .not context', async () => {
    client.send('Hello');
    // biome-ignore lint/suspicious/noExplicitAny: test helper casts to access matcher internals
    await expect((expect(server) as any).not.toReceiveHello()).rejects.toThrowErrorMatchingInlineSnapshot(
      '[Error: Expected the next received message is not Hello, but got Hello]'
    );
  });

  it('passes when received "Hi!" under .not context', async () => {
    client.send('Hi!');
    // biome-ignore lint/suspicious/noExplicitAny: test helper casts to access matcher internals
    await (expect(server) as any).not.toReceiveHello();
  });
});
