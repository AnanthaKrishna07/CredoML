const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Applicant = sequelize.define('Applicant', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  creditScore: { type: DataTypes.INTEGER, allowNull: false },
  annualIncome: { type: DataTypes.FLOAT, allowNull: false },
  loanAmount: { type: DataTypes.FLOAT, allowNull: false },
  debtToIncomeRatio: { type: DataTypes.FLOAT, allowNull: false },
  employmentDurationYears: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Applicant;