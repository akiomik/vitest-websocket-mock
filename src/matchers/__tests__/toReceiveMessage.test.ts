/**
 * @copyright Romain Bertrand 2018
 * @copyright Akiomi Kamakura 2023
 */

import '../../extend-expect';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import WS from '../../websocket';

let server: WS, client: WebSocket;
beforeEach(async () => {
  server = new WS('ws://localhost:1234');
  client = new WebSocket('ws://localhost:1234');
  await server.connected;
});

afterEach(() => {
  WS.clean();
});

describe('.toReceiveMessage', () => {
  it('passes when the websocket server receives the expected message', async () => {
    client.send('hello there');
    await expect(server).toReceiveMessage('hello there');
  });

  it('passes when the websocket server receives the expected message with custom timeout', async () => {
    setTimeout(() => {
      client.send('hello there');
    }, 2000);

    await expect(server).toReceiveMessage('hello there', { timeout: 3000 });
  });

  it('passes when the websocket server receives the expected JSON message', async () => {
    const jsonServer = new WS('ws://localhost:9876', { jsonProtocol: true });
    const jsonClient = new WebSocket('ws://localhost:9876');
    await jsonServer.connected;
    jsonClient.send(`{"answer":42}`);
    await expect(jsonServer).toReceiveMessage({ answer: 42 });
  });

  it('fails when called with an expected argument that is not a valid WS', async () => {
    expect.hasAssertions();
    await expect(expect('boom').toReceiveMessage('hello there')).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Error: expect(WS).toReceiveMessage(expected)

      Expected the websocket object to be a valid WS mock.
      Received: string
        "boom"]
    `);
  });

  it('fails when the WS server does not receive the expected message', async () => {
    expect.hasAssertions();
    await expect(expect(server).toReceiveMessage('hello there')).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Error: expect(WS).toReceiveMessage(expected)

      Expected the websocket server to receive a message,
      but it didn't receive anything in 1000ms.]
    `);
  });

  it('fails when the WS server does not receive the expected message with custom timeout', async () => {
    expect.hasAssertions();
    await expect(expect(server).toReceiveMessage('hello there', { timeout: 3000 })).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Error: expect(WS).toReceiveMessage(expected)

      Expected the websocket server to receive a message,
      but it didn't receive anything in 3000ms.]
    `);
  });

  it('fails when the WS server receives a different message', async () => {
    expect.hasAssertions();
    client.send('hello there');
    await expect(expect(server).toReceiveMessage('HI!')).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Error: expect(WS).toReceiveMessage(expected)

      Expected the next received message to equal:
        "HI!"
      Received:
        "hello there"]
    `);
  });

  it('replaces trailing spaces with middle dots in the failure message', async () => {
    expect.hasAssertions();
    client.send('hello \nthere  ');
    await expect(expect(server).toReceiveMessage('HI!')).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Error: expect(WS).toReceiveMessage(expected)

      Expected the next received message to equal:
        "HI!"
      Received:
        "hello·
      there  "]
    `);
  });

  // TODO: Fix Object indentation
  it('fails when expecting a JSON message but the server is not configured for JSON protocols', async () => {
    expect.hasAssertions();
    client.send(`{"answer":42}`);
    await expect(expect(server).toReceiveMessage({ answer: 42 })).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Error: expect(WS).toReceiveMessage(expected)

      Expected the next received message to equal:
        Object {
        "answer": 42,
      }
      Received:
        "{"answer":42}"]
    `);
  });
});

describe('.not.toReceiveMessage', () => {
  it("passes when the websocket server doesn't receive the expected message", async () => {
    client.send('hello there');
    await expect(server).not.toReceiveMessage("What's up?");
  });

  it('fails when called with an expected argument that is not a valid WS', async () => {
    expect.hasAssertions();
    await expect(expect('boom').not.toReceiveMessage('hello there')).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Error: expect(WS).not.toReceiveMessage(expected)

      Expected the websocket object to be a valid WS mock.
      Received: string
        "boom"]
    `);
  });

  it("fails when the WS server doesn't receive any messages", async () => {
    expect.hasAssertions();
    await expect(expect(server).not.toReceiveMessage('hello there')).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Error: expect(WS).not.toReceiveMessage(expected)

      Expected the websocket server to receive a message,
      but it didn't receive anything in 1000ms.]
    `);
  });

  it('fails when the WS server receives the un-expected message', async () => {
    expect.hasAssertions();
    client.send('hello there');
    await expect(expect(server).not.toReceiveMessage('hello there')).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Error: expect(WS).not.toReceiveMessage(expected)

      Expected the next received message to not equal:
        "hello there"
      Received:
        "hello there"]
    `);
  });
});
