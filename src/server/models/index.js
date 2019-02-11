const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
    logging: false
  }
);

const models = {
  User: sequelize.import('./user'),
  Message: sequelize.import('./message')
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

const eraseDatabaseOnSync = true;

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'jeremyphilipson',
      messages: [
        {
          text: 'Finished Java courses'
        }
      ]
    },
    {
      include: [models.Message]
    }
  );

  await models.User.create(
    {
      username: 'carolynfine',
      messages: [
        {
          text: 'Went to ballet'
        },
        {
          text: 'Is tired bea'
        }
      ]
    },
    {
      include: [models.Message]
    }
  );
};

module.exports = {
  sequelize,
  models,
  createUsersWithMessages,
  eraseDatabaseOnSync
};
