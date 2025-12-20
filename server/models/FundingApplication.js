'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FundingApplication extends Model {
        static associate(models) {
            FundingApplication.belongsTo(models.FundingProgram, { foreignKey: 'program_id', as: 'program' });
            FundingApplication.belongsTo(models.User, { foreignKey: 'applicant_id', as: 'applicant' });
        }
    }
    FundingApplication.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        program_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        applicant_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected', 'under_review'),
            defaultValue: 'pending'
        },
        proposal_text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        amount_requested: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },
        documents: {
            type: DataTypes.ARRAY(DataTypes.STRING), // URLs to uploaded docs
            defaultValue: []
        },
        reviewed_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'FundingApplication',
        tableName: 'funding_applications',
        underscored: true,
    });
    return FundingApplication;
};
