const { urlencoded } = require('express');
const express = require('express')
const multer = require('multer');
// const upload = multer({ storage : fileStorageEngine})

const app = express()
const port = 3000
const users = require('./routes/users');
const admin = require('./routes/admin');
const picture = require('./routes/picture');
const info = require('./routes/info');

app.use(express.json())
app.use(urlencoded({ extended: true }))
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.use('/api/users', users)
app.use('/api/admin', admin)
app.use('/api/picture', picture)
app.use('/api/info', info)

