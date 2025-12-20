'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class LandInquiry extends Model {
        static associate(models) {
            LandInquiry.belongsTo(models.LandListing, { foreignKey: 'land_id', as: 'land' });
            LandInquiry.belongsTo(models.User, { foreignKey: 'buyer_id', as: 'buyer' });
        }
    }
    LandInquiry.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        land_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        buyer_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'acknowledged', 'contacted', 'closed'),
            defaultValue: 'pending'
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'LandInquiry',
        tableName: 'land_inquiries',
        underscored: true,
    });
    return LandInquiry;
};
