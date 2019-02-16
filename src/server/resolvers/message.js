const { combineResolvers } = require('graphql-resolvers')
const { isAuthenticated, isMessageOwner } = require('./authorization')
const { pubsub, EVENTS } = require('../subscription')

module.exports = {
	Query: {
		messages: async (parent, args, { models: { Message } }) =>
			await Message.findAll(),
		message: async (parent, { id }, { models: { Message } }) =>
			await Message.findByPk(id)
	},

	Mutation: {
		createMessage: combineResolvers(
			isAuthenticated,
			async (parent, { text }, { me, models: { Message } }) => {
				const message = await Message.create({
					text,
					userId: me.id
				})

				pubsub.publish(EVENTS.MESSAGE.CREATED, {
					messageCreated: { message }
				})
				return message
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
			await User.findByPk(message.userId)
	},

	Subscription: {
		messageCreated: {
			subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED)
		}
	}
}
