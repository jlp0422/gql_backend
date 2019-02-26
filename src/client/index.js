import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { RetryLink } from 'apollo-link-retry'
import { onError } from 'apollo-link-error'
import './style.css'
import App from './App'

const GITHUB_BASE_URL = 'https://api.github.com/graphql'

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		console.error(graphQLErrors)
	}

	if (networkError) {
		new RetryLink({
			delay: {
				initial: 300,
				max: Infinity,
				jitter: true
			},
			attempts: {
				max: 5,
				retryIf: (error /*_operation*/) => Boolean(error)
			}
		})
	}
})

const httpLink = new HttpLink({
	uri: GITHUB_BASE_URL,
	headers: {
		authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`
	}
})

const cache = new InMemoryCache()
const link = ApolloLink.from([errorLink, httpLink])

const client = new ApolloClient({
	link,
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
