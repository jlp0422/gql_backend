const { gql } = require('apollo-server-express')

module.exports = gql`
	extend type Query {
		messages: [Message!]!
		message(id: ID!): Message!
	}

	extend type Mutation {
		createMessage(text: String!): Message!
		deleteMessage(id: ID!): Boolean!
	}

	type Message {
		id: ID!
		text: String!
		createdAt: Date!
		user: User!
	}

	extend type Subscription {
		messageCreated: MessageCreated!
	}

	type MessageCreated {
		message: Message!
	}
`
