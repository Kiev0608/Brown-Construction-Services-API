const { Maintenance, User } = require('../models');
const { sendEmail } = require('../utils/emailService');
const { sendSms } = require('../utils/smsService');

exports.createRequest = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    const clientId = req.user.id;
    const reqRec = await Maintenance.create({ clientId, title, description, imageUrl });
    // Notify admins/project managers (for demo we'll just log or use emailService if configured)
    // sendEmail(...) or sendSms(...)
    res.status(201).json(reqRec);
  } catch (err) {
    res.status(400).json({ message: 'Error creating maintenance request', error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const list = await Maintenance.findAll({ include: [{ model: User, as: 'client', attributes: ['id','name','email'] }, { model: User, as: 'contractor', attributes: ['id','name','email'] }] });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching requests', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const rec = await Maintenance.findByPk(req.params.id);
    if (!rec) return res.status(404).json({ message: 'Not found' });
    res.json(rec);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

exports.assignContractor = async (req, res) => {
  try {
    const { contractorId } = req.body;
    const rec = await Maintenance.findByPk(req.params.id);
    if (!rec) return res.status(404).json({ message: 'Not found' });
    rec.contractorId = contractorId;
    rec.status = 'In Progress';
    await rec.save();
    // notify contractor
    const contractor = await User.findByPk(contractorId);
    if (contractor) {
      await sendEmail(contractor.email, 'New Task Assigned', `You have been assigned to maintenance #${rec.id}`);
      await sendSms(contractor.phone || '', `Assigned task #${rec.id}`); // phone optional
    }
    res.json(rec);
  } catch (err) {
    res.status(500).json({ message: 'Error assigning contractor', error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const rec = await Maintenance.findByPk(req.params.id);
    if (!rec) return res.status(404).json({ message: 'Not found' });
    rec.status = status;
    await rec.save();
    // notify client/admin about status change
    const client = await User.findByPk(rec.clientId);
    if (client) {
      await sendEmail(client.email, `Maintenance #${rec.id} status updated`, `Status is now ${status}`);
    }
    res.json(rec);
  } catch (err) {
    res.status(500).json({ message: 'Error updating status', error: err.message });
  }
};
