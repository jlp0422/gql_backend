require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

const schema = require('./schema');
const resolvers = require('./resolvers');
const {
  models,
  sequelize,
  createUsersWithMessages,
  eraseDatabaseOnSync
} = require('./models');

const app = express();
app.use(cors());
const { PORT } = process.env;

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async () => ({
    models,
    me: await models.User.findByLogin('jeremyphilipson')
  })
});

server.applyMiddleware({ app, path: '/graphql' });

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }

  app.listen(PORT, () => {
    console.log(`apollo server listening on ${PORT}`);
  });
});
