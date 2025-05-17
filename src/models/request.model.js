const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Request extends Model {
    static associate(models) {
      Request.belongsTo(models.Entity, {
        foreignKey: 'entityId',
        as: 'entity'
      });
      Request.hasMany(models.Person, {
        foreignKey: 'requestId',
        as: 'persons'
      });
    }
  }

  Request.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'),
      defaultValue: 'PENDING'
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Request'
  });

  return Request;
};