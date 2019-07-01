const userDataService = {
	getAllUserData(knex) {
		return knex.select('*').from('users_data')
	},

	insertUserData(knex, newData) {
		return knex
			.insert(newData)
			.into('users_data')
			.returning('*')
			.then(rows => {
				return rows[0]
			})
	},

	getById(knex, code) {
		return knex
			.from('users_data')
			.select('*')
			.where('code', code)

	},

	getRatings(knex, rating) {
		return knex
			.from('users_data')
			.select('*')
			.where('rating', rating)

	},

	deleteUserData(knex, id) {
		return knex('users_data')
			.where({
				id
			})
			.delete()
	},

	updateUserData(knex, id, newUserDataFields) {
		return knex('users_data')
			.where({
				id
			})
			.update(newUserDataFields)
	},
}

module.exports = userDataService;