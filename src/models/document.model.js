const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Document extends Model {
    static associate(models) {
      Document.belongsTo(models.Person, {
        foreignKey: 'personId',
        as: 'person'
      });
      Document.hasMany(models.Resource, {
        foreignKey: 'documentId',
        as: 'resources'
      });
    }
  }

  Document.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
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