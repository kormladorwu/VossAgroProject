'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        static associate(models) {
            // define association here
        }
    }
    Admin.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('admin', 'moderator'),
            defaultValue: 'admin',
            allowNull: false
        },
        permissions: {
            type: DataTypes.JSON,
            defaultValue: {}
        },
        last_login: {
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        modelName: 'Admin',
        tableName: 'admins',
        underscored: true,
    });
    return Admin;
};
