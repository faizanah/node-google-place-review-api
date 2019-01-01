'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
  return [
    queryInterface.addColumn('reviews', 'deletedAt', {
      type: Sequelize.DATE
    }),
    queryInterface.addColumn('users', 'reportReviewsCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }),
    queryInterface.addColumn('places', 'reportReviewsCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }),
    queryInterface.removeColumn('reviews', 'type', 'contentType')
  ];
  },

  down: (queryInterface, Sequelize) => {
   return [
     queryInterface.removeColumn('reviews', 'deletedAt'),
     queryInterface.removeColumn('users', 'reportReviewsCount'),
     queryInterface.removeColumn('places', 'reportReviewsCount'),
     queryInterface.removeColumn('reviews', 'contentType', 'type')
   ];
  }
};
