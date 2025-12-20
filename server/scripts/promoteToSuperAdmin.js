const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const { User } = require('../models');

const promoteToSuperAdmin = async () => {
    const email = process.argv[2];

    if (!email) {
        console.log('Usage: node scripts/promoteToSuperAdmin.js <email>');
        process.exit(1);
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
        const user = await User.findOne({ where: { email: normalizedEmail } });

        if (!user) {
            console.log(`User with email ${email} not found.`);
            process.exit(1);
        }

        user.role = 'super_admin';
        await user.save();

        console.log(`Success! User ${user.name} (${user.email}) is now a Super Admin.`);
        process.exit(0);
    } catch (error) {
        console.error('Error promoting user:', error);
        process.exit(1);
    }
};

promoteToSuperAdmin();
