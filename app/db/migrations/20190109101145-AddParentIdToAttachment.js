'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
  return [
    queryInterface.addColumn('attachments', 'parentId', {
      type: Sequelize.UUID
    })
  ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('attachments', 'parentId')
    ];
  }
};
