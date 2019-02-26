import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import IssueItem from '../IssueItem'
import Loading from '../../Loading'
import ErrorMessage from '../../Error'
import { ButtonUnobtrusive } from '../../Button'

import './style.css'

const GET_ISSUES_OF_REPOSITORY = gql`
	query(
		$repositoryOwner: String!
		$repositoryName: String!
		$issueState: IssueState!
	) {
		repository(name: $repositoryName, owner: $repositoryOwner) {
			issues(first: 5, states: [$issueState]) {
				edges {
					node {
						id
						number
						state
						title
						url
						bodyHTML
					}
				}
			}
		}
	}
`

const ISSUE_STATES = {
	NONE: 'NONE',
	OPEN: 'OPEN',
	CLOSED: 'CLOSED'
}

const TRANSITION_LABELS = {
	[ISSUE_STATES.NONE]: 'Show Open Issues',
	[ISSUE_STATES.OPEN]: 'Show Closed Issues',
	[ISSUE_STATES.CLOSED]: 'Hide Issues'
}

const TRANSITION_STATE = {
	[ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
	[ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
	[ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE
}

const showIssue = issueState => issueState !== ISSUE_STATES.NONE

const IssueList = ({ issues }) => (
	<div className="IssueList">
		{issues.edges.map(({ node }) => (
			<IssueItem key={node.id} issue={node} />
		))}
	</div>
)

class Issues extends React.Component {
	state = {
		issueState: ISSUE_STATES.NONE
	}

	onChangeIssueState = nextIssueState => {
		this.setState({ issueState: nextIssueState })
	}

	render() {
		const { issueState } = this.state
		const { repositoryName, repositoryOwner } = this.props
		return (
			<div className="Issues">
				<ButtonUnobtrusive
					onClick={() => this.onChangeIssueState(TRANSITION_STATE[issueState])}
				>
					{TRANSITION_LABELS[issueState]}
				</ButtonUnobtrusive>
				{showIssue(issueState) && (
					<Query
						query={GET_ISSUES_OF_REPOSITORY}
						variables={{
							repositoryName,
							repositoryOwner,
							issueState
						}}
					>
						{({ data, loading, error }) => {
							if (error) {
								return <ErrorMessage error={error} />
							}

							const { repository } = data

							if (loading && !repository) {
								return <Loading />
							}

							const filteredRepo = {
								issues: {
									edges: repository.issues.edges.filter(
										issue => issue.node.state === issueState
									)
								}
							}

							if (!filteredRepo.issues.edges.length) {
								return <div className="IssuesList">No issues</div>
							}

							return <IssueList issues={filteredRepo.issues} />
						}}
					</Query>
				)}
			</div>
		)
	}
}

export default Issues
