"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.addColumn(
      'favtrails',
      'name',
      DataTypes.STRING
      );
    migration.addColumn(
      'favtrails',
      'city',
      DataTypes.STRING
      );



    done();
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.removeColumn(
      'favtrails',
      'name'
      );
    migration.removeColumn(
      'favtrails',
      'city'
      );
    done();
  }
};
