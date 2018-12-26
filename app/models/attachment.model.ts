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
    type: {
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
    }
  }, {
    timestamps: true,
    freezeTableName: true,
    tableName: 'attachments'

  })
  Attachment.associate = function(models) {
    Attachment.belongsTo(models.Review , { as: 'review' , foreignKey: 'reviewId' })
  }
  return Attachment
}
