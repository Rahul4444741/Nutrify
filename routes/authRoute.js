const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const config = require('./config')
const User = require('../models/User')

const authRouter = express.Router()

authRouter.post("/signup", (req, res) => {
    // Create User API
    const hashedPassword = bcrypt.hashSync(req.body.password, 8)
    
    User.create({
        email: req.body.email,
        password: hashedPassword,
        max_calories: req.body.max_cal
    }, (err, user) => {
        if (err) {
            res.status(500)
            res.json({ status: false,
                message: "Error creating user."
            })
        } else {
            // Creating Token
            const token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400
            })
            // Sending Response
            res.status(200)
            res.json({ 
                status: true,
                token: token,
                message: "Successfully created user."
            })
        }
    })
})

authRouter.post("/signin", (req, res) => {
    // Create User API
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            res.status(500)
            res.json({ status: false, message: "Server Error."})
            return
        }
        if (!user) {
            res.status(404)
            res.json({ status: false, message: "User not found."})
            return
        }
        const passIsValid = bcrypt.compareSync(req.body.password, user.password)
        if (passIsValid) {
            const token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400
            })
            res.status(200)
            res.json({ status: true, token: token, message: "Success, Auth token."})
        } else {
            res.status(401)
            res.json({ status: false, token: null, message: "Email or Password is incorrect."})
        }
    })
})

authRouter.get("/whoami", (req, res) => {
    // Just a testing API to check JWT works
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        res.status(401)
        res.json({ status: false, message: "No token provided."})
    } else {
        jwt.verify(token, config.secret, (err, data) => {
            if (err) {
                res.status(500)
                res.json({ status: false, message: "Can't authenticate token."})
            } else {
                User.findById(data.id, { password: 0}, (err, user) => {
                    if (err) {
                        res.status(500)
                        res.json( { status: false, message: "There was a problem finding the user."})
                        return
                    } 
                    if (!user) {
                        res.status(404)
                        res.json({ status: false, message: "Can't find user."})
                        return
                    }

                    res.status(200)
                    res.json({ status: true, data: user, message: "Success"})
                })
            }
        })
    }
})

module.exports = authRouter