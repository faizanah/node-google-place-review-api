'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn( 'places', 'name', Sequelize.STRING(512) );
    queryInterface.addColumn( 'places', 'address', Sequelize.STRING(512) );
    queryInterface.addColumn( 'places', 'contact', Sequelize.STRING(25) );
    queryInterface.addColumn( 'places', 'latitude', Sequelize.DECIMAL );
    queryInterface.addColumn( 'places', 'longitude', Sequelize.DECIMAL );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn( 'places', 'name' );
    queryInterface.removeColumn( 'places', 'address' );
    queryInterface.removeColumn( 'places', 'contact' );
    queryInterface.removeColumn( 'places', 'latitude' );
    queryInterface.removeColumn( 'places', 'longitude' );
  }
}
