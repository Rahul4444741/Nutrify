const mongoose = require('mongoose')

const uri = "mongodb+srv://Rahul:xhvcfOg4ME3Oa2IE@cluster0.xuq2j.mongodb.net/nutrify?retryWrites=true&w=majority"

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})

const dbClient = mongoose.connection;

module.exports = dbClient