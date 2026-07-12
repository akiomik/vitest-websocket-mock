# vitest-websocket-mock

[![npm version](https://badge.fury.io/js/vitest-websocket-mock.svg)](https://badge.fury.io/js/vitest-websocket-mock)
[![Build Status](https://github.com/akiomik/vitest-websocket-mock/actions/workflows/ci.yml/badge.svg)](https://github.com/akiomik/vitest-websocket-mock/actions)
[![codecov](https://codecov.io/gh/akiomik/vitest-websocket-mock/branch/main/graph/badge.svg?token=40OVYIT90L)](https://codecov.io/gh/akiomik/vitest-websocket-mock)

A set of utilities and Vitest matchers to help testing complex websocket interactions:
mock websocket servers, wait for connections and messages, and assert on them
with dedicated matchers.

Originally forked from [romgain/jest-websocket-mock](https://github.com/romgain/jest-websocket-mock),
and since developed independently as a Vitest-first library.

**Examples:**
Several examples are provided in the [examples folder](https://github.com/akiomik/vitest-websocket-mock/blob/main/examples/).
In particular:

- [testing a redux saga that manages a websocket connection](https://github.com/akiomik/vitest-websocket-mock/blob/main/examples/redux-saga/src/__tests__/saga.test.ts)
- [testing a component using the saga above](https://github.com/akiomik/vitest-websocket-mock/blob/main/examples/redux-saga/src/__tests__/App.test.tsx)
- [testing a component that manages a websocket connection using react hooks](https://github.com/akiomik/vitest-websocket-mock/blob/main/examples/hooks/src/App.test.tsx)

## When to use this vs. MSW

[Vitest recommends](https://vitest.dev/guide/mocking/requests) [Mock Service Worker (MSW)](https://mswjs.io)
for mocking network requests, and MSW has first-class
[WebSocket support](https://mswjs.io/docs/websocket/). The two address different
layers of the problem:

- **MSW** provides declarative, network-level mocking (`ws.link()` handlers).
  It shines when you want to share handlers between your app, Storybook, and
  tests, or when you also need to mock HTTP or GraphQL.
- **`vitest-websocket-mock`** provides imperative test-flow ergonomics that MSW
  does not: a `WS` mock-server object, `await server.connected`, a synchronous
  record of received messages in `server.messages`, and custom matchers such as
  `.toReceiveMessage` and `.toHaveReceivedMessages`.

If your test reads best as a step-by-step conversation with a mock server
("wait for the connection, assert on the next message, reply, assert again"),
this library is the better fit. Running this library on top of MSW's
interceptor, which would make the two complementary rather than alternatives,
is being explored in [#77](https://github.com/akiomik/vitest-websocket-mock/issues/77).

## Install

`vitest-websocket-mock` requires Vitest as a peer dependency.

```bash
npm install -D vitest-websocket-mock
```

## Mock a websocket server

### The `WS` constructor

`vitest-websocket-mock` exposes a `WS` class that can instantiate mock websocket
servers that keep track of the messages they receive, and in turn
can send messages to connected clients.

```js
import WS from 'vitest-websocket-mock';

// create a WS instance, listening on port 1234 on localhost
const server = new WS('ws://localhost:1234');

// real clients can connect
const client = new WebSocket('ws://localhost:1234');
await server.connected; // wait for the server to have established the connection

// the mock websocket server will record all the messages it receives
client.send('hello');

// the mock websocket server can also send messages to all connected clients
server.send('hello everyone');

// ...simulate an error and close the connection
server.error();

// ...or gracefully close the connection
server.close();

// The WS class also has a static "clean" method to gracefully close all open connections,
// particularly useful to reset the environment between test runs.
WS.clean();
```

The `WS` constructor also accepts an optional options object as second argument:

- `jsonProtocol: true` can be used to automatically serialize and deserialize JSON messages:

```js
const server = new WS('ws://localhost:1234', { jsonProtocol: true });
server.send({ type: 'GREETING', payload: 'hello' });
```

- The [`mock-socket`](https://github.com/thoov/mock-socket) server options `verifyClient` and `selectProtocol` are directly passed through to the underlying mock server's constructor.

### Attributes of a `WS` instance

A `WS` instance has the following attributes:

- `connected`: a Promise that resolves every time the `WS` instance receives a
  new connection. The resolved value is the `WebSocket` instance that initiated
  the connection.
- `closed`: a Promise that resolves every time a connection to a `WS` instance
  is closed.
- `nextMessage`: a Promise that resolves every time a `WS` instance receives a
  new message. The resolved value is the received message (deserialized as a
  JavaScript Object if the `WS` was instantiated with the `{ jsonProtocol: true }`
  option).
- `messages`: an array that synchronously and cumulatively records every
  message received by the `WS` instance, in the order they were received.
  Since it's updated synchronously, it can be used to assert that no message
  has been received without waiting on a timeout (see
  [Run assertions on received messages](#run-assertions-on-received-messages)).

### Methods on a `WS` instance

- `send`: send a message to all connected clients. (The message will be
  serialized from a JavaScript Object to a JSON string if the `WS` was
  instantiated with the `{ jsonProtocol: true }` option).
- `close`: gracefully closes all opened connections.
- `error`: sends an error message to all connected clients and closes all
  opened connections.
- `on`: attach event listeners to handle new `connection`, `message` and `close` events. The callback receives the `socket` as its only argument.

## Run assertions on received messages

`vitest-websocket-mock` registers custom Vitest matchers to make assertions
on received messages easier. They are registered automatically when
`vitest-websocket-mock` is imported, so no extra setup file is needed:

- `.toReceiveMessage`: async matcher that waits for the next message received
  by the mock websocket server, and asserts its content. It will time out
  with a helpful message after 1000ms.
- `.toHaveReceivedMessages`: synchronous matcher that checks that all the
  expected messages have been received by the mock websocket server.

**Note**: `.toHaveReceivedMessages([])` always passes, since it only checks
that every expected message is included in the received messages, and an
empty list of expected messages is trivially satisfied. To assert that _no_
message has been received, check `server.messages` directly instead (see
below).

### Run assertions on messages as they are received by the mock server

```js
test('the server keeps track of received messages, and yields them as they come in', async () => {
  const server = new WS('ws://localhost:1234');
  const client = new WebSocket('ws://localhost:1234');

  await server.connected;
  client.send('hello');
  await expect(server).toReceiveMessage('hello');
  expect(server).toHaveReceivedMessages(['hello']);
});
```

### Assert that a message has not been received

`server.messages` is updated synchronously, so it can be checked immediately
without waiting for a timeout:

```js
test('asserts that no message has been received', async () => {
  const server = new WS('ws://localhost:1234');
  const client = new WebSocket('ws://localhost:1234');

  await server.connected;
  expect(server.messages).toEqual([]);
});
```

### Send messages to the connected clients

```js
test('the mock server sends messages to connected clients', async () => {
  const server = new WS('ws://localhost:1234');
  const client1 = new WebSocket('ws://localhost:1234');
  await server.connected;
  const client2 = new WebSocket('ws://localhost:1234');
  await server.connected;

  const messages = { client1: [], client2: [] };
  client1.onmessage = (e) => {
    messages.client1.push(e.data);
  };
  client2.onmessage = (e) => {
    messages.client2.push(e.data);
  };

  server.send('hello everyone');
  expect(messages).toEqual({
    client1: ['hello everyone'],
    client2: ['hello everyone'],
  });
});
```

### JSON protocols support

`vitest-websocket-mock` can also automatically serialize and deserialize
JSON messages:

```js
test('the mock server seamlessly handles JSON protocols', async () => {
  const server = new WS('ws://localhost:1234', { jsonProtocol: true });
  const client = new WebSocket('ws://localhost:1234');

  await server.connected;
  client.send(`{ "type": "GREETING", "payload": "hello" }`);
  await expect(server).toReceiveMessage({ type: 'GREETING', payload: 'hello' });
  expect(server).toHaveReceivedMessages([{ type: 'GREETING', payload: 'hello' }]);

  let message = null;
  client.onmessage = (e) => {
    message = e.data;
  };

  server.send({ type: 'CHITCHAT', payload: 'Nice weather today' });
  expect(message).toEqual(`{"type":"CHITCHAT","payload":"Nice weather today"}`);
});
```

### verifyClient server option

A `verifyClient` function can be given in the options for the `vitest-websocket-mock` constructor.
This can be used to test behaviour for a client that connects to a WebSocket server it's blacklisted from for example.

**Note** : _Currently `mock-socket`'s implementation does not send any parameters to this function (unlike the real `ws` implementation)._

```js
test('rejects connections that fail the verifyClient option', async () => {
  new WS('ws://localhost:1234', { verifyClient: () => false });
  const errorCallback = vi.fn();

  await expect(
    new Promise((resolve, reject) => {
      errorCallback.mockImplementation(reject);
      const client = new WebSocket('ws://localhost:1234');
      client.onerror = errorCallback;
      client.onopen = resolve;
    })
    // WebSocket onerror event gets called with an event of type error and not an error
  ).rejects.toEqual(expect.objectContaining({ type: 'error' }));
});
```

### selectProtocol server option

A `selectProtocol` function can be given in the options for the `vitest-websocket-mock` constructor.
This can be used to test behaviour for a client that connects to a WebSocket server using the wrong protocol.

```js
test('rejects connections that fail the selectProtocol option', async () => {
  const selectProtocol = () => null;
  new WS('ws://localhost:1234', { selectProtocol });
  const errorCallback = vi.fn();

  await expect(
    new Promise((resolve, reject) => {
      errorCallback.mockImplementationOnce(reject);
      const client = new WebSocket('ws://localhost:1234', 'foo');
      client.onerror = errorCallback;
      client.onopen = resolve;
    })
  ).rejects.toEqual(
    // WebSocket onerror event gets called with an event of type error and not an error
    expect.objectContaining({
      type: 'error',
      currentTarget: expect.objectContaining({ protocol: 'foo' }),
    })
  );
});
```

### Sending errors

```js
test('the mock server sends errors to connected clients', async () => {
  const server = new WS('ws://localhost:1234');
  const client = new WebSocket('ws://localhost:1234');
  await server.connected;

  let disconnected = false;
  let error = null;
  client.onclose = () => {
    disconnected = true;
  };
  client.onerror = (e) => {
    error = e;
  };

  server.send('hello everyone');
  server.error();
  expect(disconnected).toBe(true);
  expect(error.origin).toBe('ws://localhost:1234/');
  expect(error.type).toBe('error');
});
```

### Add custom event listeners

#### For instance, to refuse connections:

```js
it('the server can refuse connections', async () => {
  const server = new WS('ws://localhost:1234');
  server.on('connection', (socket) => {
    socket.close({ wasClean: false, code: 1003, reason: 'NOPE' });
  });

  const client = new WebSocket('ws://localhost:1234');
  client.onclose = (event) => {
    expect(event.code).toBe(1003);
    expect(event.wasClean).toBe(false);
    expect(event.reason).toBe('NOPE');
  };

  expect(client.readyState).toBe(WebSocket.CONNECTING);

  await server.connected;
  expect(client.readyState).toBe(WebSocket.CLOSING);

  await server.closed;
  expect(client.readyState).toBe(WebSocket.CLOSED);
});
```

### Environment set up and tear down between tests

You can set up a mock server and a client, and reset them between tests:

```js
beforeEach(async () => {
  server = new WS('ws://localhost:1234');
  client = new WebSocket('ws://localhost:1234');
  await server.connected;
});

afterEach(() => {
  WS.clean();
});
```

## Known issues

`mock-socket` has a strong usage of delays (`setTimeout` to be more specific). This means using `vi.useFakeTimers();` will cause issues such as the client appearing to never connect to the server.

While running the websocket server from tests within the jsdom environment (as opposed to node)
you may see errors of the nature:

```bash
 ReferenceError: setImmediate is not defined
```

You can work around this by installing the setImmediate shim from
[https://github.com/YuzuJS/setImmediate](https://github.com/YuzuJS/setImmediate) and
adding `require('setimmediate');` to your `setupTests.js`.

## Testing React applications

When testing React applications, `vitest-websocket-mock` will look for
`@testing-library/react`'s implementation of [`act`](https://react.dev/reference/react/act).
If it is available, it will wrap all the necessary calls in `act`, so you don't have to.

If `@testing-library/react` is not available, we will assume that you're not testing a React application,
and you might need to call `act` manually.

## Using `vitest-websocket-mock` to interact with a non-global WebSocket object

`vitest-websocket-mock` uses [Mock Socket](https://github.com/thoov/mock-socket)
under the hood to mock out WebSocket clients.
Out of the box, Mock Socket will only mock out the global `WebSocket` object.
If you are using a third-party WebSocket client library (eg. a Node.js
implementation, like [`ws`](https://github.com/websockets/ws)), you'll need
to set up a [manual mock](https://vitest.dev/api/vi.html#vi-mock):

- Create a `__mocks__` folder in your project root
- Add a new file in the `__mocks__` folder named after the library you want to
  mock out. For instance, for the `ws` library: `__mocks__/ws.js`.
- Export Mock Socket's implementation in-lieu of the normal export from the
  library you want to mock out. For instance, for the `ws` library:

```js
// __mocks__/ws.js

export { WebSocket as default } from 'mock-socket';
```

- Somewhere in the test files, call `vi.mock` with the name of the library you want to mock. For instance, for the `ws` library:

```js
// foo.test.js

import WebSocket from 'ws';
import { vi } from 'vitest';

vi.mock('ws');

// do some tests...
```

**NOTE** The `ws` library is not 100% compatible with the browser API, and
the `mock-socket` library that `vitest-websocket-mock` uses under the hood only
implements the browser API.
As a result, `vitest-websocket-mock` will only work with the `ws` library if you
restrict yourself to the browser APIs!
