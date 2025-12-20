'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LandListing extends Model {
    static associate(models) {
      LandListing.belongsTo(models.User, { foreignKey: 'owner_id', as: 'owner' });
      LandListing.hasMany(models.LandInquiry, { foreignKey: 'land_id', as: 'inquiries', onDelete: 'CASCADE' });
    }
  }
  LandListing.init({
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
      type: DataTypes.TEXT
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.FLOAT, // In acres
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('lease', 'sale'),
      allowNull: false
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'LandListing',
    tableName: 'land_listings',
    underscored: true,
  });
  return LandListing;
};