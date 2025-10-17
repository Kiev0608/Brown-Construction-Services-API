const { Quotation, Invoice, User } = require('../models');
const { sendEmail } = require('../utils/emailService');

exports.createQuotation = async (req, res) => {
  try {
    const { maintenanceId, description, lineItems } = req.body;
    const total = (lineItems || []).reduce((s, it) => s + (it.qty * Number(it.unitPrice || 0)), 0);
    const q = await Quotation.create({ maintenanceId, description, lineItems, total });
    res.status(201).json(q);
  } catch (err) {
    res.status(400).json({ message: 'Error creating quotation', error: err.message });
  }
};

exports.getQuotations = async (req, res) => {
  const list = await Quotation.findAll();
  res.json(list);
};

exports.convertQuotationToInvoice = async (req, res) => {
  try {
    const quotationId = req.params.quotationId;
    const q = await Quotation.findByPk(quotationId);
    if (!q) return res.status(404).json({ message: 'Quotation not found' });
    if (q.status !== 'Approved') return res.status(400).json({ message: 'Quotation must be Approved to convert' });
    // For demo: use maintenance.clientId if exists or req.user.id
    let clientId = req.body.clientId;
    if (!clientId && q.maintenanceId) {
      // optional: fetch maintenance and set clientId
      // skipping fetch for brevity; assume clientId provided
    }
    const invoice = await Invoice.create({
      quotationId,
      clientId: clientId || req.user.id,
      amount: q.total,
      status: 'Unpaid',
      dueDate: req.body.dueDate || null
    });
    // notify client
    const client = await User.findByPk(invoice.clientId);
    if (client) await sendEmail(client.email, 'Invoice Created', `Invoice #${invoice.id} for amount ${invoice.amount}`);
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Error converting quotation', error: err.message });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const { clientId, amount, paymentMethod, dueDate } = req.body;
    const inv = await Invoice.create({ quotationId: null, clientId, amount, paymentMethod, dueDate });
    res.status(201).json(inv);
  } catch (err) {
    res.status(400).json({ message: 'Error creating invoice', error: err.message });
  }
};

exports.getInvoices = async (req, res) => {
  const invoices = await Invoice.findAll();
  res.json(invoices);
};

exports.getInvoiceById = async (req, res) => {
  const inv = await Invoice.findByPk(req.params.id);
  if (!inv) return res.status(404).json({ message: 'Invoice not found' });
  res.json(inv);
};

exports.recordPayment = async (req, res) => {
  try {
    const { method, reference } = req.body; // method=PayFast|PayPal|EFT
    const inv = await Invoice.findByPk(req.params.id);
    if (!inv) return res.status(404).json({ message: 'Invoice not found' });
    inv.status = 'Paid';
    inv.paymentMethod = method;
    await inv.save();
    // notify parties
    const client = await User.findByPk(inv.clientId);
    if (client) await sendEmail(client.email, 'Payment Received', `Payment for invoice #${inv.id} received.`);
    res.json(inv);
  } catch (err) {
    res.status(500).json({ message: 'Error recording payment', error: err.message });
  }
};

exports.sendReminder = async (req, res) => {
  try {
    const inv = await Invoice.findByPk(req.params.id);
    if (!inv) return res.status(404).json({ message: 'Invoice not found' });
    const client = await User.findByPk(inv.clientId);
    if (client) {
      await sendEmail(client.email, 'Invoice Reminder', `Invoice #${inv.id} is ${inv.status}. Please pay ${inv.amount}.`);
    }
    res.json({ message: 'Reminder sent (if email configured)' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending reminder', error: err.message });
  }
};
