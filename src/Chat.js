import React, { useState } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useMutation,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { POST_MESSAGE } from './mutations';
import Messages from './Messages';

const link = new WebSocketLink({
  uri: 'ws://localhost:4000',
  options: {
    reconnect: true,
  },
});

const client = new ApolloClient({
  link,
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
});

const Chat = () => {
  const [state, setState] = useState({
    user: 'Pedro',
    content: '',
  });

  const [postMessage] = useMutation(POST_MESSAGE);

  const onSend = () => {
    if (state.content.length > 0) {
      postMessage({ variables: state });
    }
    setState({
      ...state,
      content: '',
    });
  };

  return (
    <div>
      <Messages user={state.user} />
      <input
        label="User"
        value={state.user}
        onChange={(e) => setState({ ...state, user: e.target.value })}
      />
      <input
        label="Content"
        value={state.content}
        onChange={(e) => setState({ ...state, content: e.target.value })}
        onKeyUp={(e) => {
          if (e.keyCode === 13) {
            onSend();
          }
        }}
      />
      <button onClick={onSend}>[SEND]</button>
    </div>
  );
};

const chatProvider = () => (
  <ApolloProvider client={client}>
    <Chat />
  </ApolloProvider>
);

export default chatProvider;
