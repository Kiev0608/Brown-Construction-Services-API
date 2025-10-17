const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Quotation', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    maintenanceId: { type: DataTypes.INTEGER, allowNull: true }, // optional linkage
    description: { type: DataTypes.TEXT, allowNull: false },
    lineItems: { type: DataTypes.JSON, allowNull: false, defaultValue: [] }, // [{desc, qty, unitPrice}]
    total: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    status: { type: DataTypes.ENUM('Draft','Sent','Approved','Rejected'), defaultValue: 'Draft' }
  });
};
