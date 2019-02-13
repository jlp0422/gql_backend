require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { ApolloServer, AuthenticationError } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const schema = require('./schema')
const resolvers = require('./resolvers')
const {
	models,
	sequelize,
	createUsersWithMessages,
	eraseDatabaseOnSync
} = require('./models')
const { PORT, SECRET } = process.env

const app = express()
app.use(cors())

const getMe = async req => {
	const token = req.headers['x-token']

	if (token) {
		try {
			return await jwt.verify(token, SECRET)
		} catch (error) {
			throw new AuthenticationError(
				'Your session has expired. Please log in again.'
			)
		}
	}
}

const server = new ApolloServer({
	typeDefs: schema,
	resolvers,
	formatError: error => {
		const message = error.message
			.replace('SequelizeValidationError: ', '')
			.replace('Validation error: ', '')

		return { ...error, message }
	},
	context: async ({ req }) => ({
		models,
		me: await getMe(req),
		secret: SECRET
	})
})

server.applyMiddleware({ app, path: '/graphql' })

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
	if (eraseDatabaseOnSync) {
		createUsersWithMessages()
	}

	app.listen(PORT, () => {
		console.log(`apollo server listening on ${PORT}`)
	})
})
