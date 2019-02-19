require('dotenv').config()
const { expect } = require('chai')
const URL = 'http://localhost:3000'
const request = require('supertest')(URL)
// const jwt = require('jsonwebtoken')
// const { SECRET } = process.env
// const {
// 	models: { User, Message }
// } = require('../models/index')

let adminToken, userToken

describe('#Users', () => {
	describe('user(id: String!): User', () => {
		it('returns a user when user can be found', done => {
			request
				.post('/graphql')
				.send({ query: '{ user(id: 1) { id username email } }' })
				.expect(200)
				.end((err, res) => {
					if (err) {
						return done(err)
					}
					expect(res.body.data.user.id).to.equal('1')
					done()
				})
		})

		it('returns null when no user can be found', done => {
			request
				.post('/graphql')
				.send({ query: '{ user(id: 44) {id username email } }' })
				.expect(200)
				.end((err, res) => {
					if (err) {
						return done(err)
					}
					expect(res.body.data.user).to.equal(null)
					done()
				})
		})
	})

	describe('users: Users!', () => {
		it('returns all users in the database', done => {
			request
				.post('/graphql')
				.send({ query: '{ users { id username email } }' })
				.expect(200)
				.end((err, res) => {
					if (err) {
						return done(err)
					}
					expect(res.body.data.users.length).to.equal(2)
					done()
				})
		})
	})

	describe('deleteUser(id: String!): Boolean!', () => {
		beforeEach(done => {
			request
				.post('/graphql')
				.send({
					query: `mutation {
            signIn(login: "carolynfine" password: "carolyn")
            { token }
          }`
				})
				.expect(200)
				.end((err, res) => {
					if (err) {
						return done(err)
					}
					userToken = res.body.data.signIn.token
				})

			request
				.post('/graphql')
				.send({
					query: `mutation {
            signIn(login: "jeremyphilipson" password: "jeremyp")
            { token }
          }`
				})
				.expect(200)
				.end((err, res) => {
					if (err) {
						return done(err)
					}
					adminToken = res.body.data.signIn.token
					done()
				})
		})
		it('returns an error if user is not logged in', done => {
			request
				.post('/graphql')
				.send({
					query: `
          mutation {
            deleteUser(id: "2")
          }
        `
				})
				.expect(200)
				.end((err, res) => {
					if (err) {
						return done(err)
					}
					expect(res.body.errors[0].message).to.equal(
						'Not authenticated as user.'
					)
					done()
				})
		})

		it('returns an error if user is not authorized to delete users', done => {
			request
				.post('/graphql')
				.set('x-token', userToken)
				.send({
					query: `
          mutation {
            deleteUser(id: "1")
          }
        `
				})
				.expect(200)
				.end((err, res) => {
					if (err) {
						return done(err)
					}
					expect(res.body.errors[0].message).to.equal(
						'Not authorized as admin.'
					)
					done()
				})
		})

		it('returns true when an admin deletes a user', done => {
			request
				.post('/graphql')
				.set('x-token', adminToken)
				.send({
					query: `
          mutation {
            deleteUser(id: "2")
          }
        `
				})
				.expect(200)
				.end((err, res) => {
					if (err) {
						return done(err)
					}
					expect(res.body).to.equal(true)
					done()
				})
		})
	})
})
