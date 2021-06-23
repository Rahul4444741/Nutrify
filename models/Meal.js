const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const MealSchema = new Schema({
    meal_id: String,
    meal_name: String,
    calories: Number,
    date: String
})

module.exports = mongoose.model("Meal", MealSchema)

