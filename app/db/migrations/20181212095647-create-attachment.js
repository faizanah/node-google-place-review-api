'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('attachments', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
      },
      file: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING(50)
      },
      type: {
        type: Sequelize.STRING(20)
      },
      size: {
        type: Sequelize.STRING
      },
      reviewId: {
        type: Sequelize.UUID,
        allowNull: false
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
    return queryInterface.dropTable('attachments')
  }
}
