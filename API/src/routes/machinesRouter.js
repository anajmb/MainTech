const { Router } = require('express');
const machinesController = require('../controller/machinesController');

const router = Router();

router.post('/create', (req, res) => machinesController.create(req, res));

router.get('/get', (req, res) => machinesController.getAll(req, res));

router.get('/getUnique/:id', (req, res) => machinesController.getUnique(req, res));

router.put('/update/:id', (req, res) => machinesController.update(req, res));

router.delete('/delete/:id', (req, res) => machinesController.delete(req, res));

module.exports = router;