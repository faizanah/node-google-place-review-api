'use strict'
module.exports = function(sequelize, DataTypes) {
  const Attachment = sequelize.define('Attachment', {
    id: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    file: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    contentType: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reviewId: {
      type: DataTypes.UUID,
      allowNull: false
      // references: {
      //   model: 'User',
      //   key: 'id'
      // }
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
      // references: {
      //   model: 'User',
      //   key: 'id'
      // }
    }
  }, {
    timestamps: true,
    freezeTableName: true,
    tableName: 'attachments'

  })
  Attachment.associate = function(models) {
    Attachment.belongsTo(models.Review , { as: 'review' , foreignKey: 'reviewId' })
    Attachment.belongsTo(models.User , { as: 'user' , foreignKey: 'userId' })
  }

  // User counter update
  Attachment.afterSave((attachment, options) => {
    const userId = attachment.userId
    let query = 'SELECT count(a.id) as photosCount, (select count(b.id) from attachments b where b.contentType LIKE \'video/%\' and b.userId = "' + userId + '") as videosCount FROM attachments a WHERE a.contentType LIKE \'image/%\' and a.userId = "' + userId + '";'
    sequelize.query(query).spread((results, metadata) => {
      query = 'UPDATE users SET photosCount = ' + results[0].photosCount + ', videosCount = ' + results[0].videosCount + ' WHERE users.id = "' + userId + '";'
      sequelize.query(query).spread((data, metadata) => {
      })
    })
  })
  return Attachment
}
