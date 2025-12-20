'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const fundingPrograms = [
      {
        name: "AgriStart Microfund",
        amount_range: "₵5,000 – ₵50,000",
        type: "Small Farmer Loan",
        description: "Low-interest loans for smallholder farmers to expand operations and buy improved seedlings.",
        provider: "AgriBank", // Example provider
        application_link: "https://example.com/agristart",
        eligibility_criteria: "Smallholder farmers with 1-5 acres of land.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "GreenGrow Investment Scheme",
        amount_range: "₵20,000 – ₵200,000",
        type: "Equity Investment",
        description: "Connects farmers and agritech startups with private investors interested in sustainable agriculture.",
        provider: "GreenGrow Capital",
        application_link: "https://example.com/greengrow",
        eligibility_criteria: "Farmers and agritech startups seeking equity investment.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Youth in Agro Grant",
        amount_range: "₵10,000 – ₵80,000",
        type: "Government Grant",
        description: "A non-repayable grant program targeting youth-led agribusinesses across Ghana.",
        provider: "Ministry of Food and Agriculture",
        application_link: "https://example.com/youthagro",
        eligibility_criteria: "Agribusinesses led by individuals aged 18-35.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "AgriWomen Empowerment Fund",
        amount_range: "₵15,000 – ₵100,000",
        type: "Women-Focused Funding",
        description: "Supports women farmers and cooperatives with flexible repayment plans and business training.",
        provider: "Women in Agriculture Foundation",
        application_link: "https://example.com/agriwomen",
        eligibility_criteria: "Women farmers and women-led agricultural cooperatives.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    await queryInterface.bulkInsert('FundingPrograms', fundingPrograms, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('FundingPrograms', null, {});
  }
};