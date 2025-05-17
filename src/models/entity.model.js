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
    type: {
      type: DataTypes.ENUM('NATURAL', 'JURIDICA'),
      allowNull: false
    },
    documentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isValidDocument(value) {
          if (this.type === 'NATURAL' && !/^\d{8}$/.test(value)) {
            throw new Error('El DNI debe tener 8 dígitos');
          }
          if (this.type === 'JURIDICA' && !/^\d{11}$/.test(value)) {
            throw new Error('El RUC debe tener 11 dígitos');
          }
        }
      }
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