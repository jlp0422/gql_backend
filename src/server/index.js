require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
const uuidv4 = require('uuid/v4');

const app = express();
app.use(cors());
const { PORT } = process.env;

const schema = gql`
  type Query {
    users: [User!]
    me: User
    user(id: ID!): User

    messages: [Message!]!
    message(id: ID!): Message!
  }

  type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!,
    updateMessage(id: ID!, text: String!): Message!
  }

  type User {
    id: ID!
    username: String!,
    messages: [Message!]
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;

const users = {
  1: {
    id: '1',
    username: 'jeremyphilipson',
    messageIds: [1]
  },
  2: {
    id: '2',
    username: 'carolynfine',
    messageIds: [2]
  }
};

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1'
  },
  2: {
    id: '2',
    text: 'Bye World',
    userId: '2'
  }
};

const resolvers = {
  Query: {
    me: (parent, args, { me }) => me,
    user: (parent, { id }) => users[id],
    users: () => Object.values(users),

    messages: () => Object.values(messages),
    message: (parent, { id }) => messages[id]
  },

  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id
      };

      messages[id] = message;
      users[me.id].messageIds.push(id);
      return message;
    },
    deleteMessage: (parent, { id }) => {
      const { [id]: message, ...otherMessages } = messages;
      if (!message) {
        return false;
      }
      messages = otherMessages;
      return true;
    },
    updateMessage: (parent, { id, text }) => {
      const { [id]: message, ...otherMessages } = messages;
      if (!message) {
        throw new Error('No message with that ID');
      }
      message.text = text;
      messages = { ...otherMessages, id: message };
      return message;
    }
  },

  User: {
    messages: user => Object.values(messages)
      .filter(message => message.userId === user.id)
  },

  Message: {
    user: message => users[message.userId]
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1]
  }
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen(PORT, () => console.log(`apollo server listening on ${PORT}`));
