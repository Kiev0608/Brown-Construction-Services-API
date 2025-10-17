const express = require('express');
const router = express.Router();
const controller = require('../controllers/invoice.controller');
const { authorize } = require('../middleware/auth');

router.post('/quotation', authorize(['admin','project_manager']), controller.createQuotation);
router.get('/quotation', authorize(['admin','project_manager']), controller.getQuotations);
router.post('/convert/:quotationId', authorize(['admin','project_manager']), controller.convertQuotationToInvoice);

router.post('/', authorize(['admin','project_manager']), controller.createInvoice); // create manually
router.get('/', authorize(), controller.getInvoices);
router.get('/:id', authorize(), controller.getInvoiceById);
router.post('/:id/pay', authorize(), controller.recordPayment); // simulate payment callback
router.post('/:id/remind', authorize(['admin','project_manager']), controller.sendReminder);

module.exports = router;
