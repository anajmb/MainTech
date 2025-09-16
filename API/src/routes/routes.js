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

<<<<<<< HEAD
const teamRouter = require("./teamRouter");
=======
const teamRouter = require("./teamRoutes");
>>>>>>> bfbc73ef5375634d0f4600d5e169076ab6b57cb7
router.use("/team", teamRouter);

module.exports = router;