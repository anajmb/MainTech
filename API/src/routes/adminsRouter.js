const { Router } = require("express");

const adminsController = require("../controller/adminsController");

const router = Router();

router.post("/create", (req, res) => adminsController.create(req, res));

router.get("/get", (req, res) => adminsController.getAll(req, res));

router.get("/getUnique/:id", (req, res) => adminsController.getUnique(req, res));

router.put("/update/:id", (req, res) => adminsController.update(req, res));

router.delete("/delete/:id", (req, res) => adminsController.delete(req, res));

module.exports = router;