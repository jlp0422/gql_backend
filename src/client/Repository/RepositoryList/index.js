import React from 'react'
import '../style.css'

import RepositoryItem from '../RepositoryItem'

const RepositoryList = ({ repositories }) => {
	return repositories.map(({ repo }) => (
		<div key={repo.id} className="RepositoryItem">
			<RepositoryItem {...repo} />
		</div>
	))
}

export default RepositoryList
