const { Router } = require("express");

const teamController = require("../controller/teamController");

const router = Router();

router.post("/create", (req, res) => teamController.create(req, res));

router.get("/get", (req, res) => teamController.getAll(req, res));

router.get("/getUnique/:id", (req, res) => teamController.getUnique(req, res));

router.put("/update/:id", (req, res) => teamController.update(req, res));

router.delete("/delete/:id", (req, res) => teamController.delete(req, res));

module.exports = router;