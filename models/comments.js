"use strict";

module.exports = function(sequelize, DataTypes) {
  var comments = sequelize.define("comments", {
    userId: DataTypes.INTEGER,
    trailId: DataTypes.STRING,
    comment: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        models.comments.belongsTo(models.user)
      }
    }
  });

  return comments;
};
