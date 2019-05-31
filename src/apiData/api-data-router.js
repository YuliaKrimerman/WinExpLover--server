const express = require('express');
const xss = require('xss');
const path = require('path');
const apiDataService = require('./api-data-service')

const winesRouter = express.Router();
const jsonParser = express.json();

const serializeWines = wine => ({
    id: wine.id,
    image: xss(wine.image),
    name: xss(wine.name),
    region: wine.region,
    wine_type: wine.wine_type,
	rating:wine.rating
})

winesRouter
    .route('/wines')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        apiDataService.getAllWines(knexInstance)
            .then(wines => {
                res.json(wines.map(note => ({
                        ...wine, 
            }))) 
            })
            .catch(err => {
                next(err);
            });
    })
    .post(jsonParser, (req, res, next) => {
        const { image, name, region , wine_type ,rating ,code } = req.body
        const newWine = { image, name, region , wine_type ,rating, code }

        for (const [key, value] of Object.entries(newWine)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }
	 apiDataService.insertWine(req.app.get('db'), newWine)
            .then(newWine => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl + `/${newWine.id}`)) // 
                    .json(newWine)
            })
		 	.catch(next)
    })
 

	

module.exports = winesRouter