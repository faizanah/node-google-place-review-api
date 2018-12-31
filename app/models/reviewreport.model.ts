'use strict'
module.exports = (sequelize, DataTypes) => {
  const ReviewReport = sequelize.define('ReviewReport', {
    id: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING(36),
      allowNull: false
      // references: {
      //   model: 'Place',
      //   key: 'id'
      // }
    },
    issueId: {
      type: DataTypes.INTEGER,
      allowNull: false
      // references: {
      //   model: 'Place',
      //   key: 'id'
      // }
    },
    reviewId: {
      type: DataTypes.STRING(36),
      allowNull: false
      // references: {
      //   model: 'Place',
      //   key: 'id'
      // }
    },
    status: {
      type:   DataTypes.ENUM,
      values: ['pending', 'reviewed', 'approved', 'rejected'],
      defaultValue: 'pending'
    }
  }, {
    timestamps: true,
    freezeTableName: true,
    tableName: 'review_reports'
  })
  ReviewReport.associate = function(models) {
    ReviewReport.belongsTo(models.Review , { as: 'review' , foreignKey: 'reviewId' })
    ReviewReport.belongsTo(models.User , { as: 'user', foreignKey: 'userId' })
    ReviewReport.belongsTo(models.ReportIssueReason , { as: 'issue', foreignKey: 'issueId' })
  }
  return ReviewReport
}
