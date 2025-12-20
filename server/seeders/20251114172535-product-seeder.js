'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const sampleProducts = [
      {
        name: "Fresh Cassava",
        price: 45.00,
        unit: "bag",
        region: "Eastern Region",
        image_url: "https://images.unsplash.com/photo-1623156760934-9779f466b61d?auto=format&fit=crop&w=800&q=80",
        seller_id: uuidv4(), // Generate a UUID for seller_id
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Organic Maize",
        price: 60.00,
        unit: "sack",
        region: "Ashanti Region",
        image_url: "https://images.unsplash.com/photo-1569058242254-96e4c6d7e6cf?auto=format&fit=crop&w=800&q=80",
        seller_id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Garden Tomatoes",
        price: 25.00,
        unit: "crate",
        region: "Greater Accra",
        image_url: "https://images.unsplash.com/photo-1603046891749-88d9f9af8d8e?auto=format&fit=crop&w=800&q=80",
        seller_id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Premium Yam Tubers",
        price: 75.00,
        unit: "bag",
        region: "Volta Region",
        image_url: "https://images.unsplash.com/photo-1633435054183-ded5f9cf7b2a?auto=format&fit=crop&w=800&q=80",
        seller_id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    await queryInterface.bulkInsert('Products', sampleProducts, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};