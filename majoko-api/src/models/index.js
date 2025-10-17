const { Sequelize } = require('sequelize');
const path = require('path');

const storage = process.env.DATABASE_STORAGE || path.join(__dirname, '../../data/dev.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false
});

const User = require('./user')(sequelize);
const Maintenance = require('./maintenance')(sequelize);
const Quotation = require('./quotation')(sequelize);
const Invoice = require('./invoice')(sequelize);
const Message = require('./message')(sequelize);

// Relations
User.hasMany(Maintenance, { foreignKey: 'clientId', as: 'clientRequests' });
User.hasMany(Maintenance, { foreignKey: 'contractorId', as: 'assignedTasks' });
Maintenance.belongsTo(User, { foreignKey: 'clientId', as: 'client' });
Maintenance.belongsTo(User, { foreignKey: 'contractorId', as: 'contractor' });

Quotation.belongsTo(Maintenance, { foreignKey: 'maintenanceId' });
Invoice.belongsTo(Quotation, { foreignKey: 'quotationId' });
Invoice.belongsTo(User, { foreignKey: 'clientId' });

Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

module.exports = {
  sequelize,
  User,
  Maintenance,
  Quotation,
  Invoice,
  Message
};
