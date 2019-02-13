const bcrypt = require('bcrypt')

const user = (sequelize, DataTypes) => {
	const User = sequelize.define('user', {
		username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			validate: {
				notEmpty: {
					args: true,
					msg: 'Username cannot be blank'
				}
			}
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			validate: {
				notEmpty: {
					args: true,
					msg: 'Email cannot be blank'
				},
				isEmail: {
					args: true,
					msg: 'A valid email address is required'
				}
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					args: true,
					msg: 'Password cannot be blank'
				},
				len: [7, 42]
			}
		}
	})

	User.associate = models => {
		User.hasMany(models.Message, { onDelete: 'CASCADE' })
	}

	User.findByLogin = async login => {
		let loggedInUser = await User.findOne({
			where: { username: login }
		})

		if (!loggedInUser) {
			loggedInUser = await User.findOne({
				where: { email: login }
			})
		}
		return loggedInUser
	}

	User.beforeCreate(async user => {
		user.password = await user.generatePasswordHash()
	})

	// do not make into fat arrow
	User.prototype.generatePasswordHash = async function() {
		const saltRounds = 10
		return await bcrypt.hash(this.password, saltRounds)
	}

	User.prototype.validatePassword = async function(password) {
		return await bcrypt.compare(password, this.password)
	}

	return User
}

module.exports = user
