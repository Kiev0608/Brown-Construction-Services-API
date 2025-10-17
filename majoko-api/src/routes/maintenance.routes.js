const express = require('express');
const router = express.Router();
const controller = require('../controllers/maintenance.controller');
const { authorize } = require('../middleware/auth');

router.post('/report', authorize(), controller.createRequest);            // client
router.get('/', authorize(['admin','project_manager']), controller.getAll);
router.get('/:id', authorize(), controller.getOne);
router.put('/:id/assign', authorize(['admin','project_manager']), controller.assignContractor);
router.put('/:id/status', authorize(['admin','project_manager','contractor']), controller.updateStatus);

module.exports = router;
