const axios = require('axios')

const API_URL = 'http://localhost:3000/graphql'

const user = async variables =>
	await axios.post(API_URL, {
		query: `
    query ($id: ID!) {
      user(id: $id) {
        id,
        username,
        email,
        role
      }
    }
  `,
		variables
	})

const users = async () =>
	await axios.post(API_URL, {
		query: `
      query {
        users {
          id
        }
      }
    `
	})

const me = async () =>
	await axios.post(API_URL, {
		query: `
    query {
      me {
        id,
        username,
        email
      }
    }
  `
	})

const signIn = async variables =>
	await axios.post(API_URL, {
		query: `
    mutation ($login: String!, $password: String!) {
      signIn(login: $login, password: $password) {
        token
      }
    }
  `,
		variables
	})

const deleteUser = async (variables, token) =>
	axios.post(
		API_URL,
		{
			query: `
        mutation ($id: ID!) {
          deleteUser(id: $id)
        }
      `,
			variables
		},
		{
			headers: {
				'x-token': token
			}
		}
	)

module.exports = {
	userApi: {
		user,
		users,
		me,
		signIn,
		deleteUser
	}
}
