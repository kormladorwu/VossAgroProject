'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const landListings = [
      {
        title: "10 Acres Cassava Farm Land",
        location: "Volta Region",
        price: "₵1,200 / acre",
        area: "10 Acres",
        description: "Fertile land suitable for cassava cultivation.",
        image_url: "https://images.unsplash.com/photo-1602173574767-37ac01994b2e?auto=format&fit=crop&w=800&q=80",
        owner_id: uuidv4(), // Generate a UUID for owner_id
        contact_info: "+233 24 567 8901",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Fertile Cocoa Land for Lease",
        location: "Ashanti Region",
        price: "₵2,000 / acre",
        area: "50 Acres",
        description: "Prime land for cocoa farming, long-term lease available.",
        image_url: "https://images.unsplash.com/photo-1576765608603-1e2a93f3a5f2?auto=format&fit=crop&w=800&q=80",
        owner_id: uuidv4(),
        contact_info: "+233 20 432 1123",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Irrigated Rice Land",
        location: "Northern Region",
        price: "₵900 / acre",
        area: "25 Acres",
        description: "Land with irrigation system, ideal for rice cultivation.",
        image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
        owner_id: uuidv4(),
        contact_info: "+233 27 876 4550",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Organic Vegetable Plot",
        location: "Eastern Region",
        price: "₵1,500 / acre",
        area: "5 Acres",
        description: "Small plot suitable for organic vegetable farming.",
        image_url: "https://images.unsplash.com/photo-1617957743038-86e0d6c0f76a?auto=format&fit=crop&w=800&q=80",
        owner_id: uuidv4(),
        contact_info: "+233 26 335 0089",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    await queryInterface.bulkInsert('LandListings', landListings, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('LandListings', null, {});
  }
};