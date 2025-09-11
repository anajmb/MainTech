// Importa o express
const express = require('express');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const router = express.Router();

const employeesRouter = require("./employeesRouter");
router.use("/employees", employeesRouter);

module.exports = router;