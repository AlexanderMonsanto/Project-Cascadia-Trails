"use strict";
var bcrypt = require('bcrypt')

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    email: {
      type:DataTypes.STRING,
      validate: {
        isEmail: {
          args: true,
          msg: 'Please Enter Valid Email Address'
        }
      }
    },
    age: DataTypes.INTEGER,
    password: {
      type:DataTypes.STRING,
      validate: {
        len: {
          args: [5, 100],
          msg: 'Please Create Password 5-100 Characters In Length'
        }
      }
    },
    city: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.user.hasMany(models.comments)
        models.user.hasMany(models.favtrails)
      }
    },
    hooks: {
      beforeCreate: function(data, misc, sendback){
        var passwordToEncrypt = data.password
        bcrypt.hash(passwordToEncrypt, 10, function(err, hash){
          data.password = hash;
          sendback(null, data);
        })
      }
    }
  });

  return user;
};
