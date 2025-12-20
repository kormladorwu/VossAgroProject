const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Admin } = require('../models');

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        process.env.JWT_SECRET || 'secret_key_change_me',
        { expiresIn: '30d' }
    );
};

// @desc    Register a new user (Farmer/Buyer/Investor)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, region, phone } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        // 1. Check if user exists
        const userExists = await User.findOne({ where: { email: normalizedEmail } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create user
        const user = await User.create({
            name,
            email: normalizedEmail,
            password_hash: hashedPassword,
            role: role || 'buyer', // Default to buyer if not specified
            region,
            phone
        });

        if (user) {
            res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                region: user.region,
                token: generateToken(user),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        // Check for user email
        const user = await User.findOne({ where: { email: normalizedEmail } });

        if (user && (await bcrypt.compare(password, user.password_hash))) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                region: user.region,
                token: generateToken(user),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        // Check User table first
        let user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password_hash'] }
        });

        // If not found in User, check Admin table
        if (!user) {
            user = await Admin.findByPk(req.user.id, {
                attributes: { exclude: ['password_hash'] }
            });
        }

        if (user) {
            // Return consistent format with id field
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                region: user.region,
                phone: user.phone,
                is_verified: user.is_verified,
                permissions: user.permissions // For admins
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Admin Login
// @route   POST /api/auth/admin/login
// @access  Public (Hidden)
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        const admin = await Admin.findOne({ where: { email: normalizedEmail } });

        if (admin && (await bcrypt.compare(password, admin.password_hash))) {
            // Update last login
            admin.last_login = new Date();
            await admin.save();

            res.json({
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                permissions: admin.permissions,
                token: generateToken(admin),
            });
        } else {
            res.status(401).json({ message: 'Invalid admin credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
