const { User } = require('../models');
const dotenv = require('dotenv');

dotenv.config();

const listUsers = async () => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role']
        });

        if (users.length === 0) {
            console.log('No users found in the database.');
        } else {
            console.log('Registered Users:');
            users.forEach(user => {
                console.log(`- ${user.name} (${user.email}) [Role: ${user.role}]`);
            });
        }
        process.exit(0);
    } catch (error) {
        console.error('Error listing users:', error);
        process.exit(1);
    }
};

listUsers();
