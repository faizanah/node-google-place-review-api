'use strict'
module.exports = function(sequelize, DataTypes) {
  const ReportIssueReason = sequelize.define('ReportIssueReason', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    issue: {
      type: DataTypes.TEXT
    },
    position: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    issuesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
  }, {
    timestamps: true,
    freezeTableName: true,
    tableName: 'report_issue_reasons'
  })
  ReportIssueReason.associate = function(models) {
    ReportIssueReason.hasMany(models.ReviewReport , { as: 'review_reports' , foreignKey: 'issueId',  onDelete: 'cascade' })
  }
  return ReportIssueReason
}
