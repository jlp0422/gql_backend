const Sequelize = require('sequelize')
const {
	TEST_DATABASE,
	DATABASE,
	DATABASE_USER,
	DATABASE_PASSWORD,
	DATABASE_URL
} = process.env

let sequelize
if (process.env.DATABASE_URL) {
	sequelize = new Sequelize(DATABASE_URL, {
		dialect: 'postgres'
	})
} else {
	sequelize = new Sequelize(
		TEST_DATABASE || DATABASE,
		DATABASE_USER,
		DATABASE_PASSWORD,
		{
			dialect: 'postgres',
			logging: false
		}
	)
}

const models = {
	User: sequelize.import('./user'),
	Message: sequelize.import('./message')
}

Object.keys(models).forEach(key => {
	if ('associate' in models[key]) {
		models[key].associate(models)
	}
})

const createUsersWithMessages = async date => {
	await models.User.create(
		{
			username: 'jeremyphilipson',
			email: 'jeremy@jeremy.com',
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
			email: 'carolyn@carolyn.com',
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
	createUsersWithMessages
}
