/* eslint-disable */
import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import './style.css'
import App from './App'

const GITHUB_BASE_URL = 'https://api.github.com/graphql'

console.log(process.env.GITHUB_PERSONAL_ACCESS_TOKEN)

const cache = new InMemoryCache()

const httpLink = new HttpLink({
	uri: GITHUB_BASE_URL,
	headers: {
		authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`
	}
})

const client = new ApolloClient({
	link: httpLink,
	cache
})

const root = document.getElementById('app')

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	root
)

module.hot.accept()
