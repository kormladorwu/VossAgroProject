'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, { foreignKey: 'buyer_id', as: 'buyer' });
            Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'items' });
        }
    }
    Order.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        buyer_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
            defaultValue: 'pending'
        },
        payment_reference: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        underscored: true,
    });
    return Order;
};
