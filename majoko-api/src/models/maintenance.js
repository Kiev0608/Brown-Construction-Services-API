const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Maintenance', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    clientId: { type: DataTypes.INTEGER, allowNull: false },
    contractorId: { type: DataTypes.INTEGER, allowNull: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.ENUM('Pending','In Progress','Completed'), defaultValue: 'Pending' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
};
