const { Router } = require("express");

const employeesController = require("../controller/employeesController");

const router = Router();

router.post("/create", (req, res) => employeesController.create(req, res));

router.get("/get", (req, res) => employeesController.getAll(req, res));

router.get("/getUnique/:id", (req, res) => employeesController.getUnique(req, res));

router.put("/update/:id", (req, res) => employeesController.update(req, res));

router.delete("/delete/:id", (req, res) => employeesController.delete(req, res));

module.exports = router;