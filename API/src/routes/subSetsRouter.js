const { Router } = require('express');

const subSetsController = require('../controller/subSetsController');

const router = Router();

router.post('/create', (req, res) => subSetsController.create(req, res));

router.get('/get', (req, res) => subSetsController.getAll(req, res));

router.get('/getUnique/:id', (req, res) => subSetsController.getUnique(req, res));

router.put('/update/:id', (req, res) => subSetsController.update(req, res));

router.delete('/delete/:id', (req, res) => subSetsController.delete(req, res));

module.exports = router;