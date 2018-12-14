'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
  queryInterface.addColumn( 'reviews', 'googlePlaceId', Sequelize.STRING )
  },
  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn( 'places', 'googlePlaceId')
  }
}
