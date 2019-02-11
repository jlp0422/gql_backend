module.exports = {
  Query: {
    users: async (parent, args, { models: { User } }) => await User.findAll(),
    user: async (parent, { id }, { models: { User } }) => await User.findById(id),
    me: async (parent, args, { me, models: { User } }) => await User.findById(me.id)
  },

  User: {
    messages: async (user, args, { models: { Message } }) => await Message.findAll({
      where: { userId: user.id }
    })
  }
};
