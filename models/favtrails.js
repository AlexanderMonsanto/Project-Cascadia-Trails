"use strict";

module.exports = function(sequelize, DataTypes) {
  var favtrails = sequelize.define("favtrails", {
    userId: DataTypes.INTEGER,
    trailId: DataTypes.STRING,
    city: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.favtrails.belongsTo(models.user)
      }
    }
  });

  return favtrails;
};
