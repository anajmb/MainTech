const { Router } = require('express');
const setsController = require('../controller/setsController');

const router = Router();

router.post('/create', (req, res) => setsController.create(req, res));

router.get('/get', (req, res) => setsController.getAll(req, res));

router.get('/getUnique/:id', (req, res) => setsController.getUnique(req, res));

router.put('/update/:id', (req, res) => setsController.update(req, res));

router.delete('/delete/:id', (req, res) => setsController.delete(req, res));

module.exports = router;