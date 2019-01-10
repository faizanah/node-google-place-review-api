'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('identities', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID
      },
      provider: {
        type: Sequelize.STRING
      },
      uid: {
        type: Sequelize.STRING
      },
      accessToken: {
        type: Sequelize.STRING
      },
      auth: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('identities');
  }
};
