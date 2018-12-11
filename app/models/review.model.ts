'use strict'
module.exports = function(sequelize, DataTypes) {
  const Review = sequelize.define('Review', {
    id: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isLiked: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: false
      // references: {
      //   model: 'User',
      //   key: 'id'
      // }
    },
    placeId: {
      type: DataTypes.UUID,
      allowNull: false
      // references: {
      //   model: 'Place',
      //   key: 'id'
      // }
    }
  }, {

    indexes: [{unique: true, fields: ['createdById', 'placeId']}],
    timestamps: true,
    freezeTableName: true,
    tableName: 'reviews'

  })
  Review.associate = function(models) {
    // Review.belongsTo(models.Place , { as: 'place' ,foreignKey: 'placeId' });
    // Review.belongsTo(models.User , { as: 'createdBy' ,foreignKey: 'createdById' });
  }
  return Review
}
