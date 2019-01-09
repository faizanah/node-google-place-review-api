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
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    issueId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'report_issue_reasons',
        key: 'id'
      }
    },
    reviewId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'reviews',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'reviewed', 'approved', 'rejected'],
      defaultValue: 'pending'
    }
  }, {
      timestamps: true,
      freezeTableName: true,
      tableName: 'review_reports'
    })
  ReviewReport.associate = function(models) {

    ReviewReport.belongsTo(models.ReportIssueReason, { as: 'issue', foreignKey: 'issueId' })
    ReviewReport.belongsTo(models.Review, { as: 'review', foreignKey: 'reviewId' })
    ReviewReport.belongsTo(models.User, { as: 'user', foreignKey: 'userId' })
  }
  ReviewReport.afterSave((report, options) => {
    let query = 'UPDATE `report_issue_reasons` SET `issuesCount` = COALESCE(`issuesCount`, 0) + 1 WHERE `report_issue_reasons`.`id` = ' + report.issueId
    sequelize.query(query).spread((data, metadata) => {
    })
  })
  return ReviewReport
}
