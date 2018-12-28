'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('users', 'reviewsCount', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }),
      queryInterface.addColumn('users', 'likesCount', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }),
      queryInterface.addColumn('users', 'dislikesCount', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }),
      queryInterface.addColumn('users', 'photosCount', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }),
      queryInterface.addColumn('users', 'videosCount', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }),
      queryInterface.addColumn('attachments', 'userId', {
        type: Sequelize.UUID
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
       queryInterface.removeColumn('users', 'reviewsCount'),
       queryInterface.removeColumn('users', 'likesCount'),
       queryInterface.removeColumn('users', 'dislikesCount'),
       queryInterface.removeColumn('users', 'photosCount'),
       queryInterface.removeColumn('users', 'videosCount'),
       queryInterface.removeColumn('attachments', 'userId')
    ];
  }
}
