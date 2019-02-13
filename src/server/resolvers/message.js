const { combineResolvers } = require('graphql-resolvers')
const { isAuthenticated, isMessageOwner } = require('./authorization')

module.exports = {
	Query: {
		messages: async (parent, args, { models: { Message } }) =>
			await Message.findAll(),
		message: async (parent, { id }, { models: { Message } }) =>
			await Message.findById(id)
	},

	Mutation: {
		createMessage: combineResolvers(
			isAuthenticated,
			async (parent, { text }, { me, models: { Message } }) => {
				return await Message.create({
					text,
					userId: me.id
				})
			}
		),

		deleteMessage: combineResolvers(
			isAuthenticated,
			isMessageOwner,
			async (parent, { id }, { models: { Message } }) => {
				return await Message.destroy({ where: { id } })
			}
		)
	},

	Message: {
		user: async (message, args, { models: { User } }) =>
			await User.findById(message.userId)
	}
}
