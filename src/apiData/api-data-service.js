const apiDataService = {
	getAllWines(knex) {
		return knex.select('*').from('api_data')
	},

	insertWine(knex, newWine) {
		return knex
			.insert(newWine)
			.into('api_data')
			.returning('*')
			.then(rows => {
				return rows[0]
			})
	},

	getById(knex, id) {
		return knex
			.from('api_data')
			.select('*')
			.where('id', id)
			.first()
	},

	getByName(knex, name) {
		console.log(name)
		return knex
			.from('api_data')
			.select('*')
			.where('name', 'LIKE' ,`%${name}%`)
			.first()
	},

	deleteWine(knex, id) {
		return knex('api_data')
			.where({
				id
			})
			.delete()
	},

	updateWine(knex, id, newWineFields) {
		return knex('api_data')
			.where({
				id
			})
			.update(newFolderFields)
	},
}

module.exports = apiDataService;