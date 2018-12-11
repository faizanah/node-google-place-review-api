'use strict'
module.exports = function(sequelize, DataTypes) {
  const Place = sequelize.define('Place', {
    id: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    googlePlaceId: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    reviewsCount: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    likesCount: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    dislikesCount: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {
    indexes: [{unique: true, fields: ['googlePlaceId']}],
    timestamps: true,
    freezeTableName: true,
    tableName: 'places'
  })
  Place.associate = function(models) {
    Place.hasMany(models.Review , { as: 'reviews' , foreignKey: 'placeId' })
  }
  return Place
}
