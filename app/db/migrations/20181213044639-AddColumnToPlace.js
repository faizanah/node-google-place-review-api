'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('places', 'name', Sequelize.STRING(512)),
      queryInterface.addColumn('places', 'address', Sequelize.STRING(512)),
      queryInterface.addColumn('places', 'contact', Sequelize.STRING(25)),
      queryInterface.addColumn('places', 'latitude', Sequelize.DECIMAL),
      queryInterface.addColumn('places', 'longitude', Sequelize.DECIMAL),
      queryInterface.addColumn('places', 'rating', Sequelize.FLOAT),
      queryInterface.addColumn('places', 'website', Sequelize.STRING),
      queryInterface.addColumn('places', 'mapUrl', Sequelize.STRING),
      queryInterface.addColumn('places', 'photos', Sequelize.TEXT)
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('places', 'name'),
      queryInterface.removeColumn('places', 'address'),
      queryInterface.removeColumn('places', 'contact'),
      queryInterface.removeColumn('places', 'latitude'),
      queryInterface.removeColumn('places', 'longitude'),
      queryInterface.removeColumn('places', 'rating'),
      queryInterface.removeColumn('places', 'website'),
      queryInterface.removeColumn('places', 'mapUrl'),
      queryInterface.removeColumn('places', 'photos')
    ];
  }
}
