const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const uniqid = require('uniqid')

const Meal = require('../models/Meal')
const config = require('./config')

const mealRouter = express.Router()

mealRouter.post("/createmeal", (req, res) => {
    // Create Meal API
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        res.status(401)
        res.json({ status: false, message: "No token provided."})
        return
    }

    jwt.verify(token, config.secret, (err, data) => {
        if (err) {
            res.status(500)
            res.json({ status: false, message: "Can't authenticate token."})
        } else {
            Meal.create({
                meal_id: uniqid(),
                meal_name: req.body.meal_name,
                calories: req.body.calories,
                date: req.body.date
            }, (err, meal) => {
                if (err) {
                    res.status(500)
                    res.json({ status: false,
                        message: "Error creating meal."
                    })
                } else {
                    res.status(200)
                    res.json({ 
                        status: true,
                        data: meal,
                        message: "Successfully created a Meal."
                    })
                }
            })
        }
    })  
})

mealRouter.post("/updatemeal", (req, res) => {
    // Update Meal API
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        res.status(401)
        res.json({ status: false, message: "No token provided."})
        return
    }

    jwt.verify(token, config.secret, (err, data) => {
        if (err) {
            res.status(500)
            res.json({ status: false, message: "Can't authenticate token."})
            return
        } 
        const update = { $set: { meal_name: req.body.meal_name, calories: req.body.calories }}
        Meal.updateOne({ meal_name: req.body.meal_name }, update, (err, data) => {
            if (err) {
                res.status(500)
                res.json({ status: false, message: "Server Error."})
                return
            }
            if (data.nModified == 1) {
                res.status(200)
                res.json({ status: true, message: "Successfuly updated a meal."})
            } else {
                res.status(404)
                res.json({ status: false, message: "Can't find meal with given id."})
            }
        })
    })
})

mealRouter.post("/deletemeal", (req, res) => {
    // Delete Meal API
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        res.status(401)
        res.json({ status: false, message: "No token provided."})
        return
    }

    jwt.verify(token, config.secret, (err, data) => {
        if (err) {
            res.status(500)
            res.json({ status: false, message: "Can't authenticate token."})
            return
        }

        Meal.deleteOne({ meal_id: req.body.meal_id }, (err, data) => {
            if (err) {
                res.status(500)
                res.json({ status: false, message: "Server Error."})
                return
            }
            if (data.deletedCount == 1) {
                res.status(200)
                res.json({ status: true, message: "Meal Deleted"})
            } else {
                res.status(404)
                res.json({ status: false, message: "Meal not found"})
            }
        })
    })
})

mealRouter.get("/readmeals", (req, res) => {
    // Get all Meals
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        res.status(401)
        res.json({ status: false, message: "No token provided."})
        return
    }

    jwt.verify(token, config.secret, (err, data) => {
        if (err) {
            res.status(500)
            res.json({ status: false, message: "Can't authenticate token."})
            return
        }
        
        Meal.find({ date: req.query.date }, (err, meals) => {
            if (err) {
                console.log(err)
                res.status(500)
                res.json({ status: false, message: "Internal Server Error."})
            } else {
                let totalCal = 0
                meals.forEach(meal => {
                    totalCal += meal.calories
                });
                res.status(200)
                res.json({ status: true, data: meals, total_calories: totalCal, message: "List of all meals."})
            }
        })
    })
})

module.exports = mealRouter