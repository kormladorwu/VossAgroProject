/**
 * Script to create an admin in the Admin table
 * Usage: node scripts/createAdmin.js <email> <password> <name>
 */
require('dotenv').config({ path: '.env' });
const bcrypt = require('bcryptjs');
const { Admin, sequelize } = require('../models');

const createAdmin = async () => {
    const email = process.argv[2];
    const password = process.argv[3];
    const name = process.argv[4] || 'Admin';

    if (!email || !password) {
        console.log('Usage: node scripts/createAdmin.js <email> <password> [name]');
        console.log('Example: node scripts/createAdmin.js admin@voss.com MySecure123! "Super Admin"');
        process.exit(1);
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
        // Check if admin already exists
        const existing = await Admin.findOne({ where: { email: normalizedEmail } });
        if (existing) {
            console.log(`Admin with email ${normalizedEmail} already exists.`);
            process.exit(1);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin
        const admin = await Admin.create({
            name,
            email: normalizedEmail,
            password_hash: hashedPassword,
            role: 'admin',
            permissions: ['all']
        });

        console.log('✅ Admin created successfully!');
        console.log(`   Name: ${admin.name}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
        console.log('\n📍 Login at: /admin/login');

    } catch (error) {
        console.error('Error creating admin:', error.message);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
};

createAdmin();
