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
      allowNull: false,
      validate: {
        len: {
          args: [3, 1024],
          msg: 'Review body must be between 3 and 140 characters in length'
        }
      }
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
    },
    googlePlaceId: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  }, {
      // indexes: [{unique: true, fields: ['createdById', 'placeId']}],
      timestamps: true,
      freezeTableName: true,
      tableName: 'reviews',
      paranoid: true

    })
  Review.associate = function(models) {
    Review.hasMany(models.Attachment, { as: 'attachments', foreignKey: 'reviewId', onDelete: 'cascade' })
    Review.belongsTo(models.Place, { as: 'place', foreignKey: 'placeId' })
    Review.belongsTo(models.User, { as: 'createdBy', foreignKey: 'createdById' })
    Review.hasMany(models.ReviewReport, { as: 'review_reports', foreignKey: 'reviewId', onDelete: 'cascade' })
  }
  // Place counter update
  Review.afterSave((review, options) => {
    const pId = review.placeId
    let query = 'select count(b.id) as reviewsCount, (select count(a.id) from reviews a where a.isLiked = true and a.placeId = "' + pId + '") as likesCount from reviews b where b.placeId = "' + pId + '" limit 1'
    sequelize.query(query).spread((results, metadata) => {
      console.log(results)
      query = 'UPDATE places SET reviewsCount = ' + results[0].reviewsCount + ', likesCount = ' + results[0]['likesCount'] + ', dislikesCount = ' + (results[0]['reviewsCount'] - results[0]['likesCount']) + ' WHERE places.id = "' + pId + '";'
      sequelize.query(query).spread((data, metadata) => {
      })
    })
  })
  // User counter update
  Review.afterSave((review, options) => {
    const userId = review.createdById
    let query = 'select count(b.id) as reviewsCount, (select count(a.id) from reviews a where a.isLiked = true and a.createdById = "' + userId + '") as likesCount from reviews b where b.createdById = "' + userId + '" limit 1'
    sequelize.query(query).spread((results, metadata) => {
      console.log(results)
      query = 'UPDATE users SET reviewsCount = ' + results[0].reviewsCount + ', likesCount = ' + results[0]['likesCount'] + ', dislikesCount = ' + (results[0]['reviewsCount'] - results[0]['likesCount']) + ' WHERE users.id = "' + userId + '";'
      sequelize.query(query).spread((data, metadata) => {
      })
    })
  })
  Review.afterCreate = function(review) {
    return review.reload()
  }
  return Review
}
