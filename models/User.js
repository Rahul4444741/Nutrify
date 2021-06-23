const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const UserSchema = new Schema({
    email: String,
    password: String,
    max_calories: Number
})

module.exports = mongoose.model('User', UserSchema)
