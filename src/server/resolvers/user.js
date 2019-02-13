const jwt = require('jsonwebtoken')
const EXPIRES_IN = '30m'

const createToken = async (user, secret, expiresIn) => {
	const { id, email, username } = user
	return await jwt.sign({ id, email, username }, secret, { expiresIn })
}

module.exports = {
	Query: {
		users: async (parent, args, { models: { User } }) => await User.findAll(),
		user: async (parent, { id }, { models: { User } }) =>
			await User.findById(id),
		me: async (parent, args, { me, models: { User } }) =>
			await User.findById(me.id)
	},

	Mutation: {
		signUp: async (
			parent,
			{ username, email, password },
			{ secret, models: { User } }
		) => {
			const user = await User.create({
				username,
				email,
				password
			})

			return { token: createToken(user, secret, EXPIRES_IN) }
		}
	},

	User: {
		messages: async (user, args, { models: { Message } }) =>
			await Message.findAll({
				where: { userId: user.id }
			})
	}
}
