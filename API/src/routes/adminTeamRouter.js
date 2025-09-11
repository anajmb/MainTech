const { Router } = require("express");

const adminTeamController = require("../controller/adminTeamController");

const router = Router();

router.post("/create", (req, res) => adminTeamController.create(req, res));

router.get("/get", (req, res) => adminTeamController.getAll(req, res));

router.get("/getUnique/:id", (req, res) => adminTeamController.getUnique(req, res));

router.put("/update/:id", (req, res) => adminTeamController.update(req, res));

router.delete("/delete/:id", (req, res) => adminTeamController.delete(req, res));

module.exports = router;