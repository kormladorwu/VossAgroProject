const { sequelize } = require('../models');

async function syncDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync all models
        // force: false ensures we don't drop existing tables unless necessary
        // alter: true updates tables to match models if they exist
        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

syncDatabase();
