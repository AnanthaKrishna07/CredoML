const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Decision = sequelize.define('Decision', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  applicantId: { type: DataTypes.UUID, allowNull: false },
  underwriterId: { type: DataTypes.UUID, allowNull: false },
  approved: { type: DataTypes.INTEGER, allowNull: false }, // 0 = Denied, 1 = Approved
  confidenceScore: { type: DataTypes.FLOAT, allowNull: false }
});

module.exports = Decision;