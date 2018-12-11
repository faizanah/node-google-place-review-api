'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('places', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
      },
      googlePlaceId: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true
      },
      reviewsCount: {
        type: Sequelize.INTEGER,
        default: 0
      },
      likesCount: {
        type: Sequelize.INTEGER,
        default: 0
      },
      dislikesCount: {
        type: Sequelize.INTEGER,
        default: 0
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
    return queryInterface.dropTable('places');
  }
}
