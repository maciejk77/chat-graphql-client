import React from 'react';
import { useSubscription } from '@apollo/client';
import { GET_MESSAGES } from './subscriptions';

const Messages = ({ user }) => {
  const { data } = useSubscription(GET_MESSAGES);

  if (!data) return null;

  return (
    <>
      {data.messages.map(({ id, user: messageUser, content }) => {
        const isActiveUser = user === messageUser;
        return (
          <div
            key={id}
            style={{
              justifyContent: isActiveUser ? 'flex-end' : 'flex-start',
              ...styles.bubblePosition,
            }}
          >
            {!isActiveUser && (
              <div style={styles.userIcon}>
                {messageUser.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div
              style={{
                background: isActiveUser ? '#58bf56' : '#e5e6ea',
                color: isActiveUser ? 'white' : 'black',
                ...styles.bubble,
              }}
            >
              {content}
            </div>
          </div>
        );
      })}
    </>
  );
};

const styles = {
  bubblePosition: {
    display: 'flex',
    paddingBottom: '1rem',
  },
  bubble: { padding: '1em', borderRadius: '1em', maxWidth: '60%' },
  userIcon: {
    height: '50',
    width: 50,
    marginRight: '0.5em',
    border: '2px solid #e5e6ea',
    borderRadius: 25,
    textAlign: 'center',
    fontSize: '18pt',
    paddingTop: 5,
  },
};

export default Messages;
