'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Define association here
      Product.belongsTo(models.User, {
        foreignKey: 'seller_id',
        as: 'seller'
      });
    }
  }
  Product.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING, // e.g., 'kg', 'bag'
      allowNull: false
    },
    quantity_available: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Array of image URLs
      defaultValue: []
    },
    freshness_score: {
      type: DataTypes.INTEGER, // 0-100
      allowNull: true
    },
    harvest_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    seller_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    underscored: true,
  });
  return Product;
};