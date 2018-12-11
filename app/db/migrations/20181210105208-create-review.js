'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('reviews', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      isLiked: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      createdById: {
        type: Sequelize.UUID,
        allowNull: false
        // onDelete: 'CASCADE',
        // references: {
        //   model: 'User',
        //   key: 'id'
        // }
      },
      placeId: {
        type: Sequelize.UUID,
        allowNull: false
        // onDelete: 'CASCADE',
        // references: {
        //   model: 'Place',
        //   key: 'id'
        // }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('reviews');
  }
}
