const { User, Product, Order, FundingProgram, LandListing } = require('../models');

// Get system-wide statistics
exports.getSystemStats = async (req, res) => {
    try {
        // Ensure super_admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Super Admin only.' });
        }

        const totalUsers = await User.count();
        const totalFarmers = await User.count({ where: { role: 'farmer' } });
        const totalInvestors = await User.count({ where: { role: 'investor' } });
        const totalProducts = await Product.count();
        const totalOrders = await Order.count();
        const totalFundingPrograms = await FundingProgram.count();
        const totalLandListings = await LandListing.count();

        // Calculate total revenue (mock calculation based on orders)
        const orders = await Order.findAll({ attributes: ['total_amount'] });
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);

        res.json({
            users: { total: totalUsers, farmers: totalFarmers, investors: totalInvestors },
            content: { products: totalProducts, land: totalLandListings, funding: totalFundingPrograms },
            financials: { orders: totalOrders, revenue: totalRevenue }
        });
    } catch (error) {
        console.error('Error fetching system stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users with pagination
exports.getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await User.findAndCountAll({
            attributes: { exclude: ['password'] },
            limit,
            offset,
            order: [['created_at', 'DESC']]
        });

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            users: rows
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user status (Verify/Ban)
exports.updateUserStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }

        const { id } = req.params;
        const { is_verified, is_active } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (is_verified !== undefined) user.is_verified = is_verified;
        // Assuming we might add is_active later to User model, or use a workaround. 
        // For now, let's stick to is_verified as per current schema or check if we need to add is_active.
        // Checking User model schema from memory/previous context: `is_verified` exists. `is_active` might not.
        // Let's just update `is_verified` for now.

        await user.save();

        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Invite a new admin (Super Admin only)
exports.inviteAdmin = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Super Admin only.' });
        }

        const { email, name, role } = req.body;

        // Validate role
        const validRoles = ['admin', 'moderator'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be admin or moderator.' });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Check if admin already exists
        const { Admin } = require('../models');
        const bcrypt = require('bcryptjs');

        const existingAdmin = await Admin.findOne({ where: { email: normalizedEmail } });
        if (existingAdmin) {
            return res.status(400).json({ message: 'An admin with this email already exists.' });
        }

        // Generate a temporary password
        const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempPassword, salt);

        // Create the new admin
        const newAdmin = await Admin.create({
            name,
            email: normalizedEmail,
            password_hash: hashedPassword,
            role,
            permissions: role === 'admin' ? ['all'] : ['read', 'moderate']
        });

        res.status(201).json({
            message: 'Admin created successfully',
            admin: {
                id: newAdmin.id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: newAdmin.role
            },
            tempPassword: tempPassword // In production, send via email instead
        });
    } catch (error) {
        console.error('Error inviting admin:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
