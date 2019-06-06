const express = require('express');
const xss = require('xss');
const userDataService = require('./users-data-service');
const path = require('path');

const userDataRouter = express.Router();
const jsonParser = express.json();


const serializeUserData = newData => ({
    id: newData.id,
    comments: xss(newData.comments),
    rating: xss(newData.rating)
})

userDataRouter
    .route('/usersData')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        userDataService.getAllUserData(knexInstance)
            .then(allData => {
                res.json(allData.map(allData => ({
                        ...allData, 
                }))) 
            })
            .catch(err => {
                next(err);
            });
    })
    .post(jsonParser, (req, res, next) => {
        const { comments, rating } = req.body
        const newData = { comments, rating }
		console.log(newData);
        for (const [key, value] of Object.entries(newData)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        userDataService.insertUserData(req.app.get('db'), newData)
            .then(newData => {
                res
                    .status(201)
              //      .location(path.posix.join(req.originalUrl + `/${note.id}`)) // req.originalUrl contains a string of the full request URL of request
                    .json(newData)
            })
            .catch(next)
    })
						 

userDataRouter
.route('/usersData/:userData_id')
.all((req, res, next) => {
    userDataService.getById(req.app.get('db'), req.params.userData_id )
    .then(newData => {
        if (!newData) {
            return res.status(404).json({
                error: { message: `Note doesn't exist` }
            })
        }
        res.newData = newData // save the note for the next middleware
        next()
    })
    .catch(next)
})
.get((req, res, next) => {
    res.json(serializeUserData(res.newData))
})
.delete((req, res, next) => {
    userDataService.deleteUserData(req.app.get('db'), req.params.userData_id )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
})


  
module.exports = userDataRouter