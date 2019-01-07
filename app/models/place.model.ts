'use strict'
import { ENV } from '../config/'
import * as GooglePlaces from 'googleplaces'
const places = new GooglePlaces(ENV.googleApiKey, 'json')
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
      indexes: [{ unique: true, fields: ['googlePlaceId'] }],
      timestamps: true,
      freezeTableName: true,
      tableName: 'places'
    })
  Place.associate = function(models) {
    Place.hasMany(models.Review, { as: 'reviews', foreignKey: 'placeId', onDelete: 'cascade' })
  }
  Place.beforeCreate(function(place, options, cb) {
    let photoArray = []
    return new Promise((resolve, reject) => {
      places.placeDetailsRequest({ placeid: place.googlePlaceId }, function(error, response) {
        if (error)
          reject(error)
        const result = response.result
        place.name = result.name
        place.contact = result.international_phone_number
        place.rating = result.rating
        place.mapUrl = result.url
        place.website = result.website
        place.address = result.formatted_address
        place.latitude = result.geometry.location.lat
        place.longitude = result.geometry.location.lng
        const photoSize = result.photos.length
        if (photoSize > 0) {
          const size = photoSize > 5 ? 5 : photoSize
          for (let i = 0; i < size; i++) {
            places.imageFetch({ photoreference: result.photos[i].photo_reference }, (error, response) => {
              photoArray.push(response)
              if (size === i + 1) {
                place.photos = JSON.stringify(photoArray)
                resolve(place)
              }
            })
          }
        } else
          resolve(place)
      })
    })
  })
  return Place
}
