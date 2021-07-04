import React from "react";
import {
  useSubscription,
  useMutation,
  gql,
} from "@apollo/client";

import { Container, Row, Col, FormInput, Button } from "shards-react";

const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      text
      user
    }
  }
`;

const POST_MESSAGE = gql`
  mutation($user: String!, $text: String!) {
    postMessage(user: $user, text: $text)
  }
`;

// eslint-disable-next-line react/prop-types
const Messages = ({ user }) => {
  const { data } = useSubscription(GET_MESSAGES);
  if (!data) {
    return null;
  }

  return (
    <>
      {data.messages.map(({ id, user: messageUser, text }) => (
        <div
              key={ id}
          style={{
            display: "flex",
            justifyContent: user === messageUser ? "flex-end" : "flex-start",
            paddingBottom: "1em",
          }}
        >
          {user !== messageUser && (
            <div
              style={{
                height: 50,
                width: 50,
                marginRight: "0.5em",
                border: "2px solid #e5e6ea",
                borderRadius: 25,
                textAlign: "center",
                fontSize: "18pt",
                paddingTop: 5,
              }}
            >
              {messageUser.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div
            style={{
              background: user === messageUser ? "blue" : "#e5e6ea",
              color: user === messageUser ? "white" : "black",
              padding: "1em",
              borderRadius: "1em",
              maxWidth: "60%",
            }}
          >
            {text}
          </div>
        </div>
      ))}
    </>
  );
};

const Chat = () => {
  const [state, stateSet] = React.useState({
    user: "Me",
    text: "",
  });
  const [postMessage] = useMutation(POST_MESSAGE);

  const onSend = () => {
    if (state.text.length > 0) {
      postMessage({
        variables: state,
      });
    }
    stateSet({
      ...state,
      text: "",
    });
  };
  return (
    <Container>
      <Messages user={state.user} />
      <Row>
        <Col xs={2} style={{ padding: 0 }}>
          <FormInput
            label="User"
            value={state.user}
            onChange={(evt) =>
              stateSet({
                ...state,
                user: evt.target.value,
              })
            }
          />
        </Col>
        <Col xs={8}>
          <FormInput
            label="Content"
            value={state.text}
            onChange={(evt) =>
              stateSet({
                ...state,
                text: evt.target.value,
              })
            }
            onKeyUp={(evt) => {
              if (evt.keyCode === 13) {
                onSend();
              }
            }}
          />
        </Col>
        <Col xs={2} style={{ padding: 0 }}>
          <Button onClick={() => onSend()} style={{ width: "100%" }}>
            Send
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat

