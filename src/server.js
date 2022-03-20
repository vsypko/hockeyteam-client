import express from 'express'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const PORT = process.env.PORT || 8080
const app = express()

app.use(express.static(__dirname))
app.use(express.static(path.resolve(__dirname,'build')))

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname,'build', 'index.html' ))
})

app.listen(PORT)