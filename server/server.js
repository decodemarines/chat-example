const express = require('express');
const { ApolloServer, gql,PubSub } = require('apollo-server-express');
const http = require('http');

const { v4: uuidv4 } = require('uuid');

const pubsub = new PubSub();

const PORT = 4000;
const messages = []

const app = express();

const typeDefs = gql`
 type Message{
     id:ID!
     user:String!
     text:String!
  }
  type Query {
    messages:[Message!]
  }
  type Mutation{
    postMessage(user:String!,text:String!):ID!
  }
  type Subscription{
    messages:[Message!]
  }
`;

const resolvers = {
    Query: {
        messages:()=>messages
    },
    Mutation: {
        postMessage: (_, { user, text }) => { 
           
            const id = uuidv4();
            messages.push({
                id,
                user,
                text
            })
            subscribers.forEach((fn) => fn())
            return id
        }
  },
  Subscription: {
    messages: {
      subscribe: (_, __, { pubsub }) => {
        const channel = Math.random().toString(24).slice(2, 15)
        msgUpdate(() => pubsub.publish(channel, { messages }))
        setTimeout(() => pubsub.publish(channel, { messages }), 0)
        return pubsub.asyncIterator(channel)
      },
    },
  },
};
const subscribers = []
const msgUpdate = (fn) => subscribers.push(fn)


async function startApolloServer() {
  const PORT = 4000;
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers, context: {pubsub}});
  await server.start();
  server.applyMiddleware({app})

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  // Make sure to call listen on httpServer, NOT on app.
  await new Promise(resolve => httpServer.listen(PORT, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
  return { server, app, httpServer };
}
startApolloServer()