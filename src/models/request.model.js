const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Request extends Model {
    static associate(models) {
      
    }
  }

  Request.init({
    status: {
      type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'),
      defaultValue: 'PENDING'
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Request'
  });

  return Request;
};