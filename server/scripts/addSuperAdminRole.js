const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const { sequelize } = require('../models');

const addSuperAdminRole = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Raw SQL to add value to ENUM type
        // Note: 'IF NOT EXISTS' is not supported for ALTER TYPE ADD VALUE in older Postgres versions, 
        // but it's safe to try. If it fails because it exists, we catch it.
        try {
            await sequelize.query("ALTER TYPE enum_users_role ADD VALUE 'super_admin';");
            console.log("Successfully added 'super_admin' to enum_users_role.");
        } catch (err) {
            if (err.original && err.original.code === '42710') {
                console.log("'super_admin' already exists in enum_users_role. Skipping.");
            } else {
                throw err;
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error updating database schema:', error);
        process.exit(1);
    }
};

addSuperAdminRole();
