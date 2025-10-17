const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Invoice', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quotationId: { type: DataTypes.INTEGER, allowNull: true },
    clientId: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    status: { type: DataTypes.ENUM('Unpaid','Paid','Overdue'), defaultValue: 'Unpaid' },
    paymentMethod: { type: DataTypes.STRING, allowNull: true },
    dueDate: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
};
