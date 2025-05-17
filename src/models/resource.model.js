const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Resource extends Model {
    static associate(models) {
      Resource.belongsTo(models.Document, {
        foreignKey: 'documentId',
        as: 'document'
      });
    }
  }

  Resource.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
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