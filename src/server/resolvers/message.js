module.exports = {
	Query: {
		messages: async (parent, args, { models: { Message } }) =>
			await Message.findAll(),
		message: async (parent, { id }, { models: { Message } }) =>
			await Message.findById(id)
	},

	Mutation: {
		createMessage: async (parent, { text }, { me, models: { Message } }) => {
			try {
				return await Message.create({
					text,
					userId: me.id
				})
			} catch (error) {
				throw new Error(error)
			}
		},
		deleteMessage: async (parent, { id }, { models: { Message } }) => {
			try {
				return await Message.destroy({ where: { id } })
			} catch (error) {
				throw new Error(error)
			}
		}
	},

	Message: {
		user: async (message, args, { models: { User } }) =>
			await User.findById(message.userId)
	}
}
