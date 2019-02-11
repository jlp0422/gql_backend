const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
  };

  User.findByLogin = async (login) => {
    let loggedInUser = await User.findOne({
      where: { username: login }
    });

    if (!loggedInUser) {
      loggedInUser = await User.findOne({
        where: { email: login }
      });
    }

    return loggedInUser;
  };

  return User;
};

module.exports = user;
