const { Message, User } = require('../models');

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, content } = req.body;
    const msg = await Message.create({ senderId, receiverId, content });
    // Optionally notify receiver (email/SMS)
    const receiver = await User.findByPk(receiverId);
    if (receiver) {
      const { sendEmail } = require('../utils/emailService');
      await sendEmail(receiver.email, 'New Message', `New message from ${req.user.email}: ${content}`);
    }
    res.status(201).json(msg);
  } catch (err) {
    res.status(400).json({ message: 'Error sending message', error: err.message });
  }
};

exports.getThreadWithUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const otherId = parseInt(req.params.userId, 10);
    const msgs = await Message.findAll({
      where: {
        // either sender=userId & receiver=otherId or opposite
        // Sequelize OR:
        $or: [
          { senderId: userId, receiverId: otherId },
          { senderId: otherId, receiverId: userId }
        ]
      },
      order: [['createdAt', 'ASC']]
    });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

exports.getUserMessages = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const msgs = await Message.findAll({ where: { receiverId: userId }, order: [['createdAt','DESC']]});
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};
