const { Router } = require('express');

const machinesController = require('../controller/machinesController');

const router = Router();

router.post('/create', (req, res) => machinesController.create(req, res));

