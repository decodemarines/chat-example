const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { v4: uuidv4 } = require('uuid');

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
            return id
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);