import React, { useState} from 'react';
import { Container, Row, Col, FormInput, Button  } from "shards-react";

import {
    useQuery,
    gql
} from "@apollo/client";


const GET_MESSAGES = gql`
  query {
  messages{
    id
    text
    user
  }
}
`
// eslint-disable-next-line react/prop-types
const Messages = ({ user }) => { 
    console.log(user)
    const { data } = useQuery(GET_MESSAGES)
    if (!data) { 
        return null
    }
    // return JSON.stringify(data)
    return (
        <>
          {data.messages.map(({ id, user: messageUser, text }) => (
              <div
                key={id}
                style={{
                   display: "flex",
                   justifyContent: user === messageUser ? "flex-end" : "flex-start",
                   paddingBottom: "1em",
              }}
            >
              {user == messageUser && (
                <div
                  style={{
                    height: 50,
                    width: 50,
                    marginRight: "0.5em",
                    border: "2px solid #e5e6ea",
                    borderRadius: 25,
                    textAlign: "center",
                    fontSize: "18pt",
                    paddingTop: 5
                  }}
                >
                  {messageUser.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div
                style={{
                  background: user === messageUser ? "aqua" : "orange",
                  color: user === messageUser ? "darkgreen" : "black",
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
}


 
const Chat = () => {
    const [state,setState] = useState({
        user: "R",
        text:''
    })
    const onSend = () => {
        if (state.text.length > 0) {
          postMessage({
            variables: state,
          });
        }
        setState({
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
              setState({
                ...state,
                user: evt.target.value,
              })
            }
          />
        </Col>
        <Col xs={8}>
          <FormInput
            label="Content"
            value={state.content}
            onChange={(evt) =>
              setState({
                ...state,
                content: evt.target.value,
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
    )
}
  
export default Chat


