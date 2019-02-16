const { expect } = require('chai')

const { userApi } = require('./api')

const getUserSignInToken = user => {
	return user.data.data.signIn.token
}

describe('#Users', () => {
	describe('user(id: String!): User', () => {
		it('returns a user when user can be found', async () => {
			const expectedResult = {
				data: {
					user: {
						id: '1',
						username: 'jeremyphilipson',
						email: 'jeremy@jeremy.com',
						role: 'ADMIN'
					}
				}
			}
			const result = await userApi.user({ id: '1' })
			expect(result.data).to.eql(expectedResult)
		})

		it('returns null when no user can be found', async () => {
			const expectedResult = {
				data: {
					user: null
				}
			}
			const result = await userApi.user({ id: '44' })
			expect(result.data).to.eql(expectedResult)
		})
	})

	describe('deleteUser(id: String!): Boolean!', () => {
		it('returns an error because only admins can delete users', async () => {
			const nonAdminUser = await userApi.signIn({
				login: 'carolynfine',
				password: 'carolyn'
			})
			const {
				data: { errors }
			} = await userApi.deleteUser(
				{ id: '1' },
				getUserSignInToken(nonAdminUser)
			)

			expect(errors[0].message).to.eql('Not authorized as admin.')
		})
		it('returns true when an admin deletes a user', async () => {
			const adminUser = await userApi.signIn({
				login: 'jeremyphilipson',
				password: 'jeremyp'
			})
			const {
				data: {
					data: { deleteUser }
				}
			} = await userApi.deleteUser({ id: '2' }, getUserSignInToken(adminUser))

			expect(deleteUser).to.eql(true)
		})
	})
})
