'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('users', 'avatar', { type: Sequelize.STRING(255)})
  },

  down: (queryInterface, Sequelize) => {
  return queryInterface.changeColumn('users', 'avatar', { type: Sequelize.STRING(64)})
  }
};
