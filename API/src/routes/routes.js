// Importa o express
const express = require('express');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const router = express.Router();

const employeesRouter = require("./employeesRouter");
router.use("/employees", employeesRouter);

const adminsRouter = require("./adminsRouter");
router.use("/admins", adminsRouter);

const adiminTeamRouter = require("./adminTeamRouter");
router.use("/adminTeam", adiminTeamRouter);

const teamRouter = require("./teamRoutes");
router.use("/team", teamRouter);

module.exports = router;