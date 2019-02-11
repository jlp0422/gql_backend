module.exports = {
  Query: {
    messages: async (parent, args, { models: { Message } }) => await Message.findAll(),
    message: async (parent, { id }, { models: { Message } }) => await Message.findById(id)
  },

  Mutation: {
    createMessage: async (parent, { text }, { me, models: { Message } }) => await Message.create({
      text,
      userId: me.id
    }),
    deleteMessage: async (parent, { id }, { models: { Message } }) =>
      await Message.destroy({ where: { id } })
  },

  Message: {
    user: async (message, args, { models: { User } }) => await User.findById(message.userId)
  }
};
