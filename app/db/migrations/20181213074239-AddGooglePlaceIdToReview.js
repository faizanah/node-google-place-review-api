'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn( 'reviews', 'googlePlaceId', Sequelize.STRING )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn( 'reviews', 'googlePlaceId')
  }
}
