'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('report_issue_reasons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      issue: {
        type: Sequelize.TEXT
      },
      position: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      issuesCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      admin_user_id: {
        type: Sequelize.INTEGER,
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('report_issue_reasons');
  }
};
