const { Order, OrderItem, Product } = require('../models');

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const { items, total_amount } = req.body; // items: [{ product_id, quantity, price }]

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Create Order
        const order = await Order.create({
            buyer_id: req.user.id,
            total_amount,
            status: 'pending',
            payment_reference: `REF-${Date.now()}` // Mock reference
        });

        // Create Order Items
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_purchase: item.price
        }));

        await OrderItem.bulkCreate(orderItems);

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get my orders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { buyer_id: req.user.id },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product', attributes: ['name', 'images'] }]
                }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
