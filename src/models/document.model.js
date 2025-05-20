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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    result: {
      type: DataTypes.ENUM('Pendiente', 'Realizado', 'Rechazado'),
      defaultValue: 'Pendiente'
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