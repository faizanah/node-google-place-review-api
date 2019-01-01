'use strict'
import * as faker from 'faker'
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
    name: {
      type: DataTypes.STRING(200)
    },
    address: {
      type: DataTypes.STRING(200)
    },
    mapUrl: {
      type: DataTypes.STRING
    },
    website: {
      type: DataTypes.STRING(200)
    },
    contact: {
      type: DataTypes.STRING(25)
    },
    latitude: {
      type: DataTypes.DECIMAL
    },
    longitude: {
      type: DataTypes.DECIMAL,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
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
    photos: {
      type: DataTypes.TEXT
    },
  }, {
    indexes: [{unique: true, fields: ['googlePlaceId']}],
    timestamps: true,
    freezeTableName: true,
    tableName: 'places'
  })
  Place.associate = function(models) {
    Place.hasMany(models.Review , { as: 'reviews' , foreignKey: 'placeId',  onDelete: 'cascade' })
  }
  Place.beforeSave((place, opts) => {
    place.name = faker.company.companyName()
    place.contact = faker.phone.phoneNumber()
    place.website = faker.internet.url()
    place.address = faker.address.streetAddress()
    place.latitude = faker.address.latitude()
    place.longitude = faker.address.longitude()
    place.photos = JSON.stringify([{
      file: faker.image.technics()
    },
      {
      file: faker.image.food()
    }])
    return sequelize.Promise.resolve(place)
  })
  return Place
}
