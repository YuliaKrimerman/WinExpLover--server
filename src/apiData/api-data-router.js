const express = require('express');
const xss = require('xss');
const path = require('path');
const apiDataService = require('./api-data-service')

const winesRouter = express.Router();
const jsonParser = express.json();



winesRouter
	.route('/wines')
	.get((req, res, next) => {
		const knexInstance = req.app.get('db');
		apiDataService.getAllWines(knexInstance)
			.then(wines => {
				res.json(wines.map(wines => ({
					...wines,
				})))
			})
			.catch(err => {
				next(err);
			});
	})


winesRouter
	.route('/wines-by-id/:id')
	.all((req, res, next) => {
		apiDataService.getById(req.app.get('db'), req.params.id)
			.then(wines => {
				if (!wines) {
					return res.status(404).json({
						error: {
							message: `No wines by id to display`
						}
					})
				}
				res.wines = wines // save the note for the next middleware
				next()
			})
			.catch(next)
	})
	.get((req, res, next) => {
		res.json(res.wines)
	})


winesRouter
	.route('/wines-by-name/:name')
	.all((req, res, next) => {
		apiDataService.getByName(req.app.get('db'), req.params.name)
			.then(wines => {
			console.log(req.params.name);
			console.log(wines);
				if (!wines) {
					return res.status(404).json({
						error: {
							message: `No wines by name to display`
						}
					})
				}
				res.wines = wines // save the note for the next middleware
				next()
			})
			.catch(next)
	})
	.get((req, res, next) => {
		res.json(res.wines)
	})

	




module.exports = winesRouter;