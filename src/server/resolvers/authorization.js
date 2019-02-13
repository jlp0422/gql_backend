const { ForbiddenError } = require('apollo-server')
const { combineResolvers, skip } = require('graphql-resolvers')

const isAuthenticated = (parent, args, { me }) => {
	return me ? skip : new ForbiddenError('Not authenticated as user.')
}

const isAdmin = combineResolvers(
	isAuthenticated,
	(parent, args, { me: { role } }) => {
		return role === 'ADMIN'
			? skip
			: new ForbiddenError('Not authorized as admin.')
	}
)

const isMessageOwner = async (parent, { id }, { me, models: { Message } }) => {
	const message = await Message.findById(id, { raw: true })

	if (message.userId !== me.id) {
		throw new ForbiddenError('Not authenticated as message owner.')
	}

	return skip
}

module.exports = {
	isAuthenticated,
	isAdmin,
	isMessageOwner
}
