import React, { useState } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  // useQuery,
  useSubscription,
  useMutation,
  gql,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';

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

const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      user
      content
    }
  }
`;

const POST_MESSAGE = gql`
  mutation ($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
  }
`;

const Messages = ({ user }) => {
  const { data } = useSubscription(GET_MESSAGES);

  if (!data) return null;

  return (
    <>
      {data.messages.map(({ id, user: messageUser, content }) => (
        <div
          key={id}
          style={{
            display: 'flex',
            justifyContent: user === messageUser ? 'flex-end' : 'flex-start',
            paddingBottom: '1rem',
          }}
        >
          {user !== messageUser && (
            <div
              style={{
                height: '50',
                width: 50,
                marginRight: '0.5em',
                border: '2px solid #e5e6ea',
                borderRadius: 25,
                textAlign: 'center',
                fontSize: '18pt',
                paddingTop: 5,
              }}
            >
              {messageUser.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div
            style={{
              background: user === messageUser ? '#58bf56' : '#e5e6ea',
              color: user === messageUser ? 'white' : 'black',
              padding: '1em',
              borderRadius: '1em',
              maxWidth: '60%',
            }}
          >
            {content}
          </div>
        </div>
      ))}
    </>
  );
};

const Chat = () => {
  const [state, setState] = useState({
    user: 'Pedro',
    content: '',
  });

  const [postMesage] = useMutation(POST_MESSAGE);

  const onSend = () => {
    if (state.content.length > 0) {
      postMesage({ variables: state });
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
        onKeyUp={(evt) => {
          if (evt.key === 13) {
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
