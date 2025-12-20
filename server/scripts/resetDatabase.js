/**
 * Script to reset the database (drops all tables and recreates them)
 * WARNING: This will delete all data!
 * Usage: node scripts/resetDatabase.js
 */
require('dotenv').config({ path: '.env' });
const { sequelize } = require('../models');

const resetDatabase = async () => {
    console.log('⚠️  WARNING: This will delete all data in the database!');
    console.log('Resetting database in 3 seconds...\n');

    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
        console.log('🔄 Dropping all tables and recreating...');
        await sequelize.sync({ force: true });
        console.log('✅ Database reset complete!');
        console.log('\nNext steps:');
        console.log('1. Create an admin: node scripts/createAdmin.js admin@voss.com YourPassword123! "Admin Name"');
        console.log('2. Register users on the frontend');
    } catch (error) {
        console.error('❌ Error resetting database:', error.message);
    } finally {
        await sequelize.close();
    }
};

resetDatabase();
