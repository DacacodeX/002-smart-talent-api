const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Resource extends Model {
    static associate(models) {
      
    }
  }

  Resource.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    },
    documentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Resource'
  });

  return Resource;
};