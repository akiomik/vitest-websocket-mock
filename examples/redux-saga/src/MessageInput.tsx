/**
 * @copyright Romain Bertrand 2018
 * @copyright AKiomi Kamakura 2023
 */

import { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Action, ActionFunctionAny } from 'redux-actions';

import { actions } from './store/reducer';

class MessageInput extends PureComponent<{ send: ActionFunctionAny<Action<unknown>> }> {
  state = { message: '' };

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ message: event.target.value });

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.send(this.state.message);
    this.setState({ message: '' });
  };

  render() {
    const { message } = this.state;
    return (
      <form className="MessageForm" onSubmit={this.onSubmit}>
        <input
          // biome-ignore lint/a11y/noAutofocus: intentional for this chat demo's single input field
          autoFocus
          className="MessageInput"
          value={message}
          onChange={this.onChange}
          placeholder="type your message here..."
        />
      </form>
    );
  }
}

export default connect(null, { send: actions.send })(MessageInput);
