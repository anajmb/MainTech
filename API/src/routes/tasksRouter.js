const { Router } = require('express');
const tasksController = require('../controller/tasksController');

const router = Router();

router.post('/create', (req, res) => tasksController.create(req, res));

router.get('/get', (req, res) => tasksController.getAll(req, res));

router.get('/getUnique/:id', (req, res) => tasksController.getUnique(req, res));

router.put('/update/:id', (req, res) => tasksController.update(req, res));

router.delete('/delete/:id', (req, res) => tasksController.delete(req, res));

module.exports = router;