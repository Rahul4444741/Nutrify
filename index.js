const express = require('express')
const dbClient = require('./db/dbclient')

const authRouter = require('./routes/authRoute')
const mealRouter = require('./routes/mealsRoute')

const app = express()

app.use(express.json())

app.use("/auth", authRouter)
app.use("/meals", mealRouter)

app.get("/api", (req, res) => {
    res.json({ message: "Welcome to Nutrify Server"})
})

app.listen(4000, () => {
    console.log("Nutrify server started at port 4000")
    dbClient.on('error', console.error.bind(console, 'connection error:'))
    dbClient.once('open', () => {
        console.log("Nutrify Database Connected")
    })
})