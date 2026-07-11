/**
 * @copyright Romain Bertrand 2018
 */

import type { Action, ActionFunctionAny } from 'redux-actions';
import { combineActions, createActions, handleActions } from 'redux-actions';

export interface Message {
  text: string;
  side: string;
}

export interface Connection {
  connected: boolean;
}

export interface State {
  messages: Message[];
  connected: boolean;
}

const defaultState: State = {
  messages: [],
  connected: false,
};

export const actions: { [actionName: string]: ActionFunctionAny<Action<unknown>> } = createActions({
  STORE_SENT_MESSAGE: (text: string): Message => ({ text, side: 'sent' }),
  STORE_RECEIVED_MESSAGE: (text: string): Message => ({ text, side: 'received' }),
  SEND: undefined,
  CONNECTION_SUCCESS: (): Connection => ({ connected: true }),
  CONNECTION_LOST: (): Connection => ({ connected: false }),
});

const reducer = handleActions<State, Message | Connection>(
  {
    [combineActions(actions.storeReceivedMessage, actions.storeSentMessage) as unknown as string]: (
      state: State,
      { payload }: { payload: Message | Connection }
    ) => ({
      ...state,
      messages: [...state.messages, payload as Message],
    }),
    [combineActions(actions.connectionSuccess, actions.connectionLost) as unknown as string]: (
      state: State,
      { payload }: { payload: Message | Connection }
    ) => ({
      ...state,
      connected: (payload as Connection).connected,
    }),
  },
  defaultState
);

export default reducer;
