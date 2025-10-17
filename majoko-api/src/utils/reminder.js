const cron = require('node-cron');
const { Invoice, User } = require('../models');
const { sendEmail } = require('./emailService');

exports.scheduleInvoiceReminders = () => {
  // Every day at 09:00 run: check unpaid & due invoices -> send reminders
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily invoice reminder job');
    try {
      const unpaid = await Invoice.findAll({ where: { status: 'Unpaid' } });
      for (const inv of unpaid) {
        // if dueDate exists and is past due -> mark overdue and notify
        if (inv.dueDate && new Date(inv.dueDate) < new Date()) {
          inv.status = 'Overdue';
          await inv.save();
        }
        const client = await User.findByPk(inv.clientId);
        if (client) {
          await sendEmail(client.email, `Reminder: Invoice #${inv.id}`, `Invoice of ${inv.amount} is ${inv.status}.`);
        }
      }
    } catch (err) {
      console.error('Reminder job error', err.message);
    }
  }, {
    timezone: 'Africa/Johannesburg'
  });
};
