const express = require('express')
const app = express()
const port = 3000
const users = require('./routes/users');

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.use('/api/users', users)