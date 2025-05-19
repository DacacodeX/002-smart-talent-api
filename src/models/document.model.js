const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Document extends Model {
    static associate(models) {

    }
  }

  Document.init({
    documentTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'DocumentTypes',
        key: 'id'
      }
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    result: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      defaultValue: 'PENDING'
    },
    personId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Document'
  });

  return Document;
};