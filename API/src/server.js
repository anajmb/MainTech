const express = require('express')
const routes = require('./routes/routes')
const { PrismaClient } = require("@prisma/client")
const cors = require("cors")

const app = express()
const prisma = new PrismaClient()

app.use(cors());

app.use(express.json())
app.use(routes)


app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.listen(8080, () => {
	console.log("Servidor rodando na porta", 8080)
})
