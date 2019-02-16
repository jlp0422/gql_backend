require('dotenv').config()
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const http = require('http')
const { ApolloServer, AuthenticationError } = require('apollo-server-express')
const schema = require('./schema')
const resolvers = require('./resolvers')
const { models, sequelize, createUsersWithMessages } = require('./models')
const { PORT, SECRET, TEST_DATABASE } = process.env

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
	context: async ({ req, connection }) => {
		if (connection) {
			return {
				models
			}
		}

		if (req) {
			return {
				models,
				me: await getMe(req),
				secret: SECRET
			}
		}
	}
})

server.applyMiddleware({ app, path: '/graphql' })

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

const isTest = Boolean(TEST_DATABASE)

sequelize.sync({ force: isTest }).then(async () => {
	if (isTest) {
		createUsersWithMessages(new Date())
	}

	httpServer.listen(PORT, () => {
		console.log(`apollo server listening on ${PORT}`)
	})
})
