const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Entity extends Model {
    static associate(models) {
      Entity.hasMany(models.Request, {
        foreignKey: 'entityId',
        as: 'requests'
      });
    }
  }

  Entity.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Entity'
  });

  return Entity;
};