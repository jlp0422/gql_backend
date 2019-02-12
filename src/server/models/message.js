const message = (sequelize, DataTypes) => {
	const Message = sequelize.define('message', {
		text: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					args: true,
					msg: 'Text is required for every message.'
				}
			}
		}
	})

	Message.associate = models => {
		Message.belongsTo(models.User)
	}

	return Message
}

module.exports = message
