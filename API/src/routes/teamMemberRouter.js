const { Router } = require("express");

const teamMemberController = require("../controller/teamMemberController");

const router = Router();

router.post("/create", (req, res) => teamMemberController.create(req, res));

router.get("/get", (req, res) => teamMemberController.getAll(req, res));

router.get("/getUnique/:id", (req, res) => teamMemberController.getUnique(req, res));

router.put("/update/:id", (req, res) => teamMemberController.update(req, res));

router.delete("/delete/:id", (req, res) => teamMemberController.delete(req, res));

module.exports = router;