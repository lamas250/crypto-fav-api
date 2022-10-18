'use strict';

const faker = require('faker')

const coins = [...Array(100)].map((coins) => ({
  name: faker.finance.currencyName(),
  symbol: faker.finance.currencyCode(),
  price: faker.finance.amount(),
  imageUrl: 'https://picsum.photos/200/200',
  favorite: false,
  createdAt: new Date(),
  updatedAt: new Date()
}))

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Coins', coins)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
