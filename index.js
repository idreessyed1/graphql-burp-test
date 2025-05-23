const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Query {
    getUser(id: ID!): User
    listUsers: [User]
  }

  type Mutation {
    createUser(username: String!, email: String!): User
    deleteUser(id: ID!): Boolean
  }
`;

const users = [
  { id: '1', username: 'alice', email: 'alice@example.com' },
  { id: '2', username: 'bob', email: 'bob@example.com' },
];

const resolvers = {
  Query: {
    getUser: (_, { id }) => users.find(u => u.id === id),
    listUsers: () => users,
  },
  Mutation: {
    createUser: (_, { username, email }) => {
      const newUser = { id: String(users.length + 1), username, email };
      users.push(newUser);
      return newUser;
    },
    deleteUser: (_, { id }) => {
      const index = users.findIndex(u => u.id === id);
      if (index > -1) {
        users.splice(index, 1);
        return true;
      }
      return false;
    }
  }
};

async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  });
}

startServer();
