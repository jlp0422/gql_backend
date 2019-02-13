const Sequelize = require('sequelize')

const sequelize = new Sequelize(
	process.env.DATABASE,
	process.env.DATABASE_USER,
	process.env.DATABASE_PASSWORD,
	{
		dialect: 'postgres',
		logging: false
	}
)

const models = {
	User: sequelize.import('./user'),
	Message: sequelize.import('./message')
}

Object.keys(models).forEach(key => {
	if ('associate' in models[key]) {
		models[key].associate(models)
	}
})

const eraseDatabaseOnSync = true

const createUsersWithMessages = async date => {
	await models.User.create(
		{
			username: 'jeremyphilipson',
			email: 'jeremyphilipson@gmail.com',
			password: 'jeremyp',
			role: 'ADMIN',
			messages: [
				{
					text: 'Finished Java courses',
					createdAt: date.setSeconds(date.getSeconds() + 1)
				}
			]
		},
		{ include: [models.Message] }
	)

	await models.User.create(
		{
			username: 'carolynfine',
			email: 'carolynjfine@gmail.com',
			password: 'carolyn',
			messages: [
				{
					text: 'Went to ballet',
					createdAt: date.setSeconds(date.getSeconds() + 1)
				},
				{
					text: 'Is tired bea',
					createdAt: date.setSeconds(date.getSeconds() + 1)
				}
			]
		},
		{ include: [models.Message] }
	)
}

module.exports = {
	sequelize,
	models,
	createUsersWithMessages,
	eraseDatabaseOnSync
}
