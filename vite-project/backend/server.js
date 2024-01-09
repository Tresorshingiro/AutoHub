const express = require('express')

//initialise the app
const app = express()

app.get('/', (req, res) => {
    res.json({"users": ["user one", "User two", "user three"]})
})

app.listen(5000, () => {
    console.log('Listening at port 3000')
})