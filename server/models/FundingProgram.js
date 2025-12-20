'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FundingProgram extends Model {
    static associate(models) {
      FundingProgram.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
      FundingProgram.hasMany(models.FundingApplication, { foreignKey: 'program_id', as: 'applications', onDelete: 'CASCADE' });
    }
  }
  FundingProgram.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2), // Large amounts for funding
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('grant', 'loan', 'investment'),
      allowNull: false
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    interest_rate: {
      type: DataTypes.FLOAT, // Percentage, e.g., 5.5
      defaultValue: 0
    },
    provider_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'FundingProgram',
    tableName: 'funding_programs',
    underscored: true,
  });
  return FundingProgram;
};