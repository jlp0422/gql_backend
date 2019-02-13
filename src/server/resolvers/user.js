const jwt = require('jsonwebtoken')
const { combineResolvers } = require('graphql-resolvers')
const { AuthenticationError, UserInputError } = require('apollo-server')
const { isAdmin } = require('./authorization')
const EXPIRE_TIME = '30m'

const createToken = async (user, secret, expiresIn) => {
	const { id, email, username, role } = user
	return await jwt.sign({ id, email, username, role }, secret, { expiresIn })
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

			return { token: createToken(user, secret, EXPIRE_TIME) }
		},

		signIn: async (
			parent,
			{ login, password },
			{ secret, models: { User } }
		) => {
			const user = await User.findByLogin(login)
			if (!user) {
				throw new UserInputError('No user found with this login')
			}
			const isValid = await user.validatePassword(password)
			if (!isValid) {
				throw new AuthenticationError('Invalid password')
			}
			return { token: createToken(user, secret, EXPIRE_TIME) }
		},

		deleteUser: combineResolvers(
			isAdmin,
			async (parent, { id }, { models: { User } }) => {
				return await User.destroy({ where: { id } })
			}
		)
	},

	User: {
		messages: async (user, args, { models: { Message } }) =>
			await Message.findAll({
				where: { userId: user.id }
			})
	}
}
