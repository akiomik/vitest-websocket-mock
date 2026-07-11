/**
 * @copyright Romain Bertrand 2018
 * @copyright Akiomi Kamakura 2023
 */

import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from 'react';

type MessageProps = { id: number; text: string; side: 'sent' | 'received' };
const Message = ({ text, side }: MessageProps) => <div>{`(${side}) ${text}`}</div>;

function App() {
  const wsRef = useRef<WebSocket>();
  const nextMessageId = useRef(0);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}:8080`);
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (event) => setMessages((m) => [{ id: nextMessageId.current++, side: 'received', text: event.data }, ...m]);
    wsRef.current = ws;
  }, []);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => setCurrentMessage(event.target.value);
  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!wsRef.current) {
      throw new Error('wsRef.current is undefind');
    }

    wsRef.current.send(currentMessage);
    setCurrentMessage('');
    setMessages((m) => [{ id: nextMessageId.current++, side: 'sent', text: currentMessage }, ...m]);
  };

  return (
    <div className="App">
      <div
        className={
          connected
            ? 'ConnectionIndicator ConnectionIndicator--connected'
            : 'ConnectionIndicator ConnectionIndicator--disconnected'
        }
        title={connected ? 'connected' : 'disconnected'}
      />

      <div className="Messages">
        {messages.map((message) => (
          <Message key={message.id} {...message} />
        ))}
      </div>

      <form className="MessageForm" onSubmit={send}>
        <input
          // biome-ignore lint/a11y/noAutofocus: intentional for this chat demo's single input field
          autoFocus
          className="MessageInput"
          value={currentMessage}
          onChange={onChange}
          placeholder="type your message here..."
        />
      </form>
    </div>
  );
}

export default App;
